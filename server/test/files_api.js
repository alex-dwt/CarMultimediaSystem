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
                    let path = '/dir 1/tempfile';
                    let absolutePath = fileType.dir + path;
                    createFakeDirs(fileType.dir);
                    execSync(`touch '${absolutePath}'`);

					request(server)
						.delete('/files/' + fileType.name + '?path=' + encodeURIComponent(path))
						.expect(204)
						.end((err, res) => {
							if (err) {
								return done(err);
							}

                            // check that file is not exist
                            execSync(`/bin/bash -c "! [[ -e '${absolutePath}' ]]"`);
							done();
						});
				}
			);

			it('Can remove directories',
				done => {
                    let path = '/dir 1';
                    let absolutePath = fileType.dir + path;
                    createFakeDirs(fileType.dir);

					request(server)
						.delete('/files/' + fileType.name + '?path=' + encodeURIComponent(path))
						.expect(204)
						.end((err, res) => {
							if (err) {
								return done(err);
							}

                            // check that directory is not exist
                            execSync(`/bin/bash -c "! [[ -e '${absolutePath}' ]]"`);
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
                    createFakeDirs(fileType.dir);
                    for (let ext of fileType.ext.concat(['fakeext'])) {
                        execSync(`
                            touch '${fileType.dir}/dir 1/file.${ext}' && \
                            touch '${fileType.dir}/dir 1/dir11/file.${ext}' && \
                            touch "${fileType.dir}/dir 1/dir\&'12/file.${ext}" && \
                            touch "${fileType.dir}/dir 1/dir\&'12/dir121/file.${ext}"
                        `);
                    }

					request(server)
						.get('/files/' + fileType.name + '?path=' + encodeURIComponent('/dir 1'))
						.expect(200)
						.end((err, res) => {
							if (err) {
								return done(err);
							}
							assert.sameDeepMembers(
                                res.body.dirs,
                                [
                                    {path: '/dir 1/dir11', files_count: fileType.ext.length, dir_name: 'dir11', is_parent_dir: false},
                                    {path: '/dir 1/dir&\'12', files_count: fileType.ext.length * 2, dir_name: 'dir&\'12', is_parent_dir: false},
                                    {path: '/', files_count: 0, dir_name: '', is_parent_dir: true}
                                ]
                            );

							request(server)
								.get('/files/' + fileType.name + '?path=' + encodeURIComponent('/dir 1/dir&\'12/dir121'))
								.expect(200)
								.end((err, res) => {
									if (err) {
										return done(err);
									}
									assert.sameDeepMembers(
										res.body.dirs,
										[{path: '/dir 1/dir&\'12', files_count: 0, dir_name: '', is_parent_dir: true}]
									);
									done();
								});
						});
				}
			);

			it('Can scan directory to get list of files',
				done => {
                    let path = '/dir 1';
                    let absolutePath = fileType.dir + path;

                    createFakeDirs(fileType.dir);
                    execSync(`cp /car-pi/server/test/samples/${fileType.name}/* '${absolutePath}'`);
                    
                    request(server)
						.get('/files/' + fileType.name + '?path=' + encodeURIComponent(path))
						.expect(200)
						.end((err, res) => {
							if (err) {
								return done(err);
							}

                            let expectedResult = [];
                            switch (fileType.name) {
                                case 'audio':
                                    expectedResult = [
                                        {name: '2', file_name: '2.mp3', title: '', duration: 9},
                                        {name: '1', file_name: '1.mp3', title: 'Test audio title', duration: 6},
                                        {name: 'fake', file_name: 'fake.mp3', title: '', duration: 0},
                                        {name: '3', file_name: '3.wav', title: '', duration: 9}
                                    ];
                                    break;
                                case 'video':
                                    expectedResult = [
                                        {name: '2', file_name: '2.avi', title: '', duration: 5},
                                        {name: '1', file_name: '1.mp4', title: 'Test video title', duration: 5},
                                        {name: 'fake', file_name: 'fake.mp4', title: '', duration: 0}
                                    ];
                                    break;
                            }

							assert.sameDeepMembers(res.body.files, expectedResult);
							done();
						});
				}
			);

		});
	}
});

/**
 * Creates following directories:
 * ./dir 1
 * ./dir 1/dir11
 * ./dir 1/dir&'12
 * ./dir 1/dir&'12/dir121
 * ./dir2
 * ./dir3
 * ./dir3/dir31
 * ./dir3/dir32
 */
function createFakeDirs(path) {
	execSync(`
	    /bin/bash -c "mkdir -p ${path}/{dir1/{dir11,dir\\&\\'12/dir121},dir2,dir3/{dir31,dir32}}" && \
	    mv ${path}/dir1 '${path}/dir 1'
	`);
}