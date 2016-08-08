/*
 * This file is part of the CarMultimediaSystem package.
 * (c) Alexander Lukashevich <aleksandr.dwt@gmail.com>
 * For the full copyright and license information, please view the LICENSE file that was distributed with this source code.
 */

'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import MediaPlayer from './service/media_player'
import FilesScanner from './service/files_scanner'
import HttpException from './exception/http_exception'

let app = express();
app.use(bodyParser.json());
app.use(express.static('/car-pi/client'));

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

	if (req.method.toLowerCase() === 'options') {
		res.status(204).send();
	} else {
		next();
	}
});

/**
 * Files Scanner
 */
app.get('/files/:type', (req, res, next) => {
    try {
		res.json(FilesScanner.scan(req.params.type, req.query.path));
    } catch (e) {
        next(e);
    }
});
app.delete('/files/:type', (req, res, next) => {
    try {
        FilesScanner.remove(req.params.type,	req.query.path);
		res.status(204).send();
	} catch (e) {
        next(e);
    }
});

/**
 * Media Player Control
 */
app.post('/player/:action', (req, res, next) => {
    try {
		let result = MediaPlayer.action(String(req.params.action), req.body);
		if (typeof result === 'boolean') {
			res.json({ success: result });
		} else {
			res.json(Object.assign({ success: true }, result));
		}
    } catch (e) {
        next(e);
    }
});

/**
 * Errors handlers
 */
app.use((req, res, next) => {
    next(new HttpException(404, 'Url does not exist'));
});

app.use((err, req, res, next) => {
	if (err instanceof HttpException) {
		res.status(err.code).json(err);
	} else {
		res.status(500).end();
	}
});

let server = app.listen(80);

export { server };