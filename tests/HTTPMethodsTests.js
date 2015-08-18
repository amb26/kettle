/**
 * Kettle HTTP Methods Tests
 *
 * Copyright 2014 Raising The Floor - International
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/kettle/LICENSE.txt
 */
 
"use strict";

var fluid = require("infusion"),
    path = require("path"),
    kettle = require("../kettle.js"),
    jqUnit = fluid.require("jqUnit"),
    configPath = path.resolve(__dirname, "./configs");
    
kettle.loadTestingSupport();

fluid.registerNamespace("kettle.tests.HTTPMethods");

// ----------------- GET HANDLING ------------------------
fluid.defaults("kettle.tests.HTTPMethods.get.handler", {
    invokers: {
        handleRequest: {
            funcName: "kettle.tests.HTTPMethods.get.handleRequest"
        }
    }
});

kettle.tests.HTTPMethods.get.handleRequest = function (request) {
    jqUnit.assertTrue("GET request successfully received", true);
    request.events.onSuccess.fire("GET Call retrieved");
};

kettle.tests.HTTPMethods.get.testResponse = function (data) {
    jqUnit.assertEquals("GET response successfully received", "GET Call retrieved", data);
};

// ----------------- POST HANDLING ------------------------
fluid.defaults("kettle.tests.HTTPMethods.post.handler", {
    invokers: {
        handleRequest: {
            funcName: "kettle.tests.HTTPMethods.post.handleRequest"
        }
    }
});

kettle.tests.HTTPMethods.post.handleRequest = function (request) {
    jqUnit.assertTrue("POST request successfully received", true);
    request.events.onSuccess.fire(request.req.body);
};

kettle.tests.HTTPMethods.post.testResponse = function (data) {
    jqUnit.assertDeepEq("POST response successfully received", {
        "msg": "I am a POST request"
    }, JSON.parse(data));
};

// ----------------- PUT HANDLING ------------------------
fluid.defaults("kettle.tests.HTTPMethods.put.handler", {
    invokers: {
        handleRequest: {
            funcName: "kettle.tests.HTTPMethods.put.handleRequest"
        }
    }
});

kettle.tests.HTTPMethods.put.handleRequest = function (request) {
    jqUnit.assertTrue("PUT request successfully received", true);
    request.events.onSuccess.fire(request.req.body);
};

kettle.tests.HTTPMethods.put.testResponse = function (data) {
    jqUnit.assertDeepEq("PUT response successfully received", {
        "msg": "I am a PUT request"
    }, JSON.parse(data));
};

//------------- Test defs for GET, POST, PUT ---------------
var testDefs = [{
    name: "HTTPMethods GET test",
    expect: 2,
    config: {
        configName: "HTTPMethods",
        configPath: configPath
    },
    components: {
        getRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/",
                method: "GET"
            }
        }
    },
    sequence: [{
        func: "{getRequest}.send"
    }, {
        event: "{getRequest}.events.onComplete",
        listener: "kettle.tests.HTTPMethods.get.testResponse"
    }]
}, { // POST test
    name: "HTTPMethods POST test",
    expect: 2,
    config: {
        configName: "HTTPMethods",
        configPath: configPath
    },
    components: {
        postRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/",
                method: "POST"
            }
        }
    },
    sequence: [{
        func: "{postRequest}.send",
        args: { "msg": "I am a POST request" }
    }, {
        event: "{postRequest}.events.onComplete",
        listener: "kettle.tests.HTTPMethods.post.testResponse"
    }]
}, { // PUT test
    name: "HTTPMethods PUT test",
    expect: 2,
    config: {
        configName: "HTTPMethods",
        configPath: configPath
    },
    components: {
        putRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/",
                method: "PUT"
            }
        }
    },
    sequence: [{
        func: "{putRequest}.send",
        args: { "msg": "I am a PUT request" }
    }, {
        event: "{putRequest}.events.onComplete",
        listener: "kettle.tests.HTTPMethods.put.testResponse"
    }]
}, { // PUT & POST combo test
    name: "HTTPMethods PUT & POST in sequence test",
    expect: 6,
    config: {
        configName: "HTTPMethods",
        configPath: configPath
    },
    components: {
        postRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/",
                method: "POST"
            }
        },
        putRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/",
                method: "PUT"
            }
        }
    },
    sequence: [{
        func: "{postRequest}.send",
        args: { "msg": "I am a POST request" }
    }, {
        event: "{postRequest}.events.onComplete",
        listener: "kettle.tests.HTTPMethods.post.testResponse"
    }, {
        func: "{putRequest}.send",
        args: { "msg": "I am a PUT request" }
    }, {
        event: "{putRequest}.events.onComplete",
        listener: "kettle.tests.HTTPMethods.put.testResponse"
    }, {
        func: "{postRequest}.send",
        args: { "msg": "I am a POST request" }
    }, {
        event: "{postRequest}.events.onComplete",
        listener: "kettle.tests.HTTPMethods.post.testResponse"
    }]
}];

kettle.test.bootstrapServer(testDefs);