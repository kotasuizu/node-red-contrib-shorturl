/**
 * Copyright (c) 2016 Kota Suizu
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 **/

module.exports = function(RED) {
    "use strict";
    var googl = require('goo.gl');



    // APIKey情報を保持するConfig
    function ShortURLConfig(n) {
        RED.nodes.createNode(this, n);
        this.key = n.key;
        var credentials = this.credentials;
        if ((credentials) && (credentials.hasOwnProperty("key"))) {
            this.key = credentials.key;
        }
    }
    RED.nodes.registerType("shorturl-config", ShortURLConfig, {
        credentials: {
            key: {
                type: "password"
            }
        }
    });

    // ShortURL NodeIO処理
    function ShortURL(n) {
        RED.nodes.createNode(this, n);

        this.shorturlConfig = RED.nodes.getNode(n.shorturlconfig);

        var node = this;
        this.on('input', function(msg) {
            // Set a developer key
            googl.setKey(node.shorturlConfig.key);
            // Get currently set developper key
            googl.getKey();
            var tmpUrl = msg.payload;
            googl.shorten(tmpUrl)
                .then(function(shortUrl) {
                    msg.payload = shortUrl;
                    node.send(msg);
                    node.log(RED._('Succeeded to shorten.'));
                }).catch(function(err) {
                    node.error("Failed to shorten. " + err.message);
                });
        });
    }
    RED.nodes.registerType("ShortURL", ShortURL);

}
