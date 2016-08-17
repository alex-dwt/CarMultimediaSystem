/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import express from 'express';
import request from 'supertest';
import FilesScanner from '../service/files_scanner'
import MediaPlayer from '../service/media_player'
import {execSync} from 'child_process';
import {assert} from 'chai';
//import {server } from '../app.js'

const SAMPLES = [
	{name: 'audio', path: '/3.wav', duration: 9},
	{name: 'video', path: '/1.mp4', duration: 5}
];

describe('Player API', () => {
    var server;

    beforeEach(() => {
        delete require.cache[require.resolve('../app')];
        server = require('../app').server;
    });

    afterEach((done) => server.close(done));

    it('Can not play with wrong (missing) params',
        done => request(server)
            .post('/player/play')
            .expect(400, {code: 400, message: 'Params are wrong or missing'}, done)
    );

    for (const fileType of FilesScanner.getTypes()) {
        describe('Type "' + fileType.name + '" (' + fileType.dir + ')', () => {
			var sample = SAMPLES.find(o => o.name === fileType.name);

			beforeEach(() => {
				MediaPlayer.action('stop');
				execSync("rm -rf '" + fileType.dir + "'");
				execSync('mkdir -p ' + fileType.dir + ' && cp $(pwd)/test/samples/' + fileType.name +'/* "' + fileType.dir + '/"');
			});

            it('Can play',
                done => request(server)
                    .post('/player/play')
                    .send({type: fileType.name, path: '/2.mp3'})
                    .expect(200, {success: true}, done)
            );

            it('Can stop',
                done => request(server)
                    .post('/player/stop')
                    .expect(200, {success: true}, done)
            );

            it('Can pause',
                done => {
					MediaPlayer.action('play', {type: fileType.name, path: sample.path});
					setTimeout(() => {
						request(server)
							.post('/player/pause')
							.expect(200, {success: true}, done)
					},1000);
				}
            );

            it('Can resume',
                done => {
					MediaPlayer.action('play', {type: fileType.name, path: sample.path});
					setTimeout(() => {
						MediaPlayer.action('pause');
						setTimeout(() => {
							request(server)
								.post('/player/resume')
								.expect(200, {success: true}, done)
						},1000);
					},1000);
				}
            );

			it('Can get status "stopped"',
				done => request(server)
						.post('/player/status')
						.expect(200, {success: true, status: 'stopped'}, done)
			);

            it('Can get status "playing"',
                done => {
					MediaPlayer.action('play', {type: fileType.name, path: sample.path});
					setTimeout(() => {
						request(server)
							.post('/player/status')
							.expect(200, {success: true, status: 'playing'}, done);
					},1000);
				}
            );

            it('Can get status "paused"',
                done => {
					MediaPlayer.action('play', {type: fileType.name, path: sample.path});
					setTimeout(() => {
						MediaPlayer.action('pause');
						setTimeout(() => {
							request(server)
								.post('/player/status')
								.expect(200, {success: true, status: 'paused'}, done);
						},1000);
					},1000);
				}
            );

			it('Can get duration',
				done => {
					MediaPlayer.action('play', {type: fileType.name, path: sample.path});
					setTimeout(() => {
						request(server)
							.post('/player/get_duration')
							.expect(200, {success: true, duration: sample.duration}, done);
					},1000);
				}
			);

			it('Can get position',
				done => {
					MediaPlayer.action('play', {type: fileType.name, path: sample.path});
					setTimeout(() => {
						request(server)
							.post('/player/get_position')
							.expect(200)
							.end((err, res) => {
								if (err) {
									return done(err);
								}
								let body = res.body;
								assert.strictEqual(body.success, true);
								assert.isAtLeast(body.position, 2);
								assert.isAtMost(body.position, 4);
								done();
							});
					},3500);
				}
			);

			it('Can set alpha',
				done => {
					MediaPlayer.action('play', {type: fileType.name, path: sample.path});
					setTimeout(() => {
						request(server)
							.post('/player/set_alpha')
							.send({alpha: 10})
							.expect(200, {success: true}, done);
					},1500);
				}
			);

			it('Can set position',
				done => {
					MediaPlayer.action('play', {type: fileType.name, path: sample.path});
					setTimeout(() => {
						request(server)
							.post('/player/set_position')
							.send({position: 3})
							.expect(200, {success: true}, done);
					},1500);
				}
			);
        });
	}
});