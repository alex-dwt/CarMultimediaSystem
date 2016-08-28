/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

import request from 'supertest';
import {execSync} from 'child_process';
import {assert} from 'chai';
//import {server } from '../app.js'

const SETTINGS_PATH = '/car-pi/server/player_settings.json';

describe('Settings API', () => {
	var server;

	beforeEach(() => {
		delete require.cache[require.resolve('../app')];
		server = require('../app').server;
		execSync("rm -rf '" +SETTINGS_PATH + "'; exit 0");
	});

	afterEach((done) => server.close(done));

	it('Can read nonexistent settings',
			done =>
				request(server)
					.get('/settings/?key=fake')
					.expect(200)
					.end((err, res) => {
						if (err) {
							return done(err);
						}

						assert.strictEqual(res.body.success, true);
						assert.deepEqual(res.body.value, { });

						done();
					})
	);

	it('Can read empty settings',
			done => {
				execSync("touch '" +SETTINGS_PATH + "'; exit 0");

				request(server)
					.get('/settings/?key=fake')
					.expect(200)
					.end((err, res) => {
						if (err) {
							return done(err);
						}

						assert.strictEqual(res.body.success, true);
						assert.deepEqual(res.body.value, { });

						done();
					});
			}
	);

	it('Can save and read settings',
			done => {
				let exampleSettings = {
					activePlayList: 1,
					activeTrack: 2,
					playlists: []
				};

				request(server)
					.post('/settings/')
					.send({key: 'example', value: exampleSettings})
					.expect(200, {success: true})
					.end((err, res) => {
						if (err) {
							return done(err);
						}

						request(server)
							.get('/settings/?key=example')
							.end((err, res) => {
								if (err) {
									return done(err);
								}

								assert.strictEqual(res.body.success, true);
								assert.deepEqual(res.body.value, exampleSettings);

								done();
							});
					});
			}
	);
});