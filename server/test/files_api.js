/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import express from 'express';
import request from 'supertest';
import FilesScanner from '../service/files_scanner'
import {execSync} from 'child_process';
import {assert} from 'chai';
//import {server } from '../app.js'

describe('Files API', () => {
	var server;

	beforeEach(() => {
		delete require.cache[require.resolve('../app')];
		server = require('../app').server;
	});

	afterEach((done) => server.close(done));

	it('Can not work with wrong "file-type" parameter',
			done => request(server)
				.get('/files/faketype')
				.expect(400, {code: 400, message: 'Wrong file type'})
				.end((err, res) => {
					if (err) {
						return done(err);
					}
					request(server)
						.delete('/files/faketype')
						.expect(400, {code: 400, message: 'Wrong file type'}, done)
				})
	);

	for (const fileType of FilesScanner.getTypes()) {
		describe('Type "' + fileType.name + '" (' + fileType.dir + ')', () => {

			beforeEach(() => execSync("rm -rf '" + fileType.dir + "'"));

			it('Can not work without "path" parameter',
				done => request(server)
					.delete('/files/' + fileType.name)
					.expect(400, {code: 400, message: 'Path is empty'}, done)
			);

			it('Can not work with empty "path" parameter',
				done => request(server)
					.delete('/files/' + fileType.name + '?path')
					.expect(400, {code: 400, message: 'Path is empty'}, done)
			);

			it('Can remove files',
				done => {
					createFakeFiles(fileType.dir);
					request(server)
						.delete('/files/' + fileType.name + '?path=' + encodeURIComponent('/dir1/tempfile'))
						.expect(204)
						.end((err, res) => {
							if (err) {
								return done(err);
							}
							assertItemsCount(fileType.dir, 9);
							done();
						});
				}
			);

			it('Can remove directories',
				done => {
					createFakeDirs(fileType.dir);
					request(server)
						.delete('/files/' + fileType.name + '?path=' + encodeURIComponent('/dir1'))
						.expect(204)
						.end((err, res) => {
							if (err) {
								return done(err);
							}
							assertItemsCount(fileType.dir, 5);
							done();
						});
				}
			);

			it('Can not remove root directory',
				done => request(server)
					.delete('/files/' + fileType.name + '?path=/')
					.expect(400, done)
			);

			it('Can scan directory to get list of directories',
				done => {
					var result = createFakeFilesWithExt(fileType.dir, fileType.ext);

					request(server)
						.get('/files/' + fileType.name + '?path=/')
						.expect(200)
						.end((err, res) => {
							if (err) {
								return done(err);
							}
							assert.property(res.body, 'dirs');
							assert.sameDeepMembers(res.body.dirs, result);
							done();
						});
				}
			);

			it('Can scan directory to get list of files',
				done => {
					var result = createSampleFiles(fileType.dir, fileType.name);

					request(server)
						.get('/files/' + fileType.name + '?path=/')
						.expect(200)
						.end((err, res) => {
							if (err) {
								return done(err);
							}
							assert.property(res.body, 'files');
							assert.sameDeepMembers(res.body.files, result);
							done();
						});
				}
			);

		});
	}
});

function createFakeFilesWithExt(path, extensions) {
	createFakeDirs(path);

	let extWithFake = extensions.concat(['fake', 'fake2']);
	for (let ext of extWithFake) {
		execSync("touch '" + path + "/dir1/file." + ext +"'");
		execSync("touch '" + path + "/dir1/dir11/file." + ext +"'");
		execSync("touch '" + path + "/dir1/dir12/file." + ext +"'");
		execSync("touch '" + path + "/dir3/file." + ext +"'");
	}

	return [
		{path: '/dir2', files_count: 0},
		{path: '/dir3', files_count: extensions.length},
		{path: '/dir1', files_count: 3 * extensions.length}
	];
}

function createSampleFiles(path, typeName) {
	createFakeDirs(path);
	execSync('cp $(pwd)/test/samples/' + typeName +'/* "' + path + '/"');

	switch (typeName) {
		case 'audio':
			return [
				{name: '2', file_name: '2.mp3', title: '', duration: 9},
				{name: '1', file_name: '1.mp3', title: 'Test audio title', duration: 6},
				{name: 'fake', file_name: 'fake.mp3', title: '', duration: 0},
				{name: '3', file_name: '3.wav', title: '', duration: 9}
			];
		case 'video':
			return [
				{name: '2', file_name: '2.avi', title: '', duration: 5},
				{name: '1', file_name: '1.mp4', title: 'Test video title', duration: 5},
				{name: 'fake', file_name: 'fake.mp4', title: '', duration: 0}
			];
		default:
			return [];
	}
}

function createFakeDirs(path) {
	execSync(
		'/bin/bash -c \'' + 'mkdir -p "' +
		path +
		'"/{dir1/{dir11,dir12},dir2,dir3/{dir31,dir32}}' + '\''
	);
	assertItemsCount(path, 8);
}

function createFakeFiles(path) {
	createFakeDirs(path);
	execSync("touch '" + path + "/dir1/tempfile'");
	execSync("touch '" + path + "/dir2/tempfile'");
	assertItemsCount(path, 10);
}

function assertItemsCount(path, count) {
	assert.strictEqual(
		parseInt(execSync('find ' + path +' 2>/dev/null | wc -l').toString()),
		count
	);
}
