import * as path from 'path';
import * as fse from 'fs-extra';
import * as https from 'https';
import * as http from 'http';
import * as request from 'request';
import * as url from 'url';
import { Service } from '@cspruit/vivi/models';

export class SystemService extends Service {
    path: typeof path;
    fs: typeof fse;
    https: typeof https;
    http: typeof http;
    request: typeof request;
    url: typeof url;

    constructor() {
        super();

        if (window.require) {
            this.path = window.require('path');
            this.fs = window.require('fs-extra');
            this.https = window.require('https');
            this.http = window.require('http');
            this.request = window.require('request');
            this.url = window.require('url');
        }
    }
}