require("source-map-support").install();
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "updates/" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "updates/" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	function hotDisposeChunk(chunkId) { //eslint-disable-line no-unused-vars
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "cc509100e883ec2df068"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks)
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded chunks
/******/ 	// "0" means "already loaded"
/******/ 	var installedChunks = {
/******/ 		14: 0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] !== 0) {
/******/ 			var chunk = require("./chunks/" + ({"0":"viewReport","1":"newTest","2":"tests","3":"testUploaded","4":"uploadError","5":"teachers","6":"students","7":"settings","8":"reports","9":"home","10":"campus","11":"graphs","12":"viewReports","13":"not-found"}[chunkId]||chunkId) + ".js");
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids;
/******/ 			for(var moduleId in moreModules) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 		}
/******/ 		return Promise.resolve();
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// uncatched error handler for webpack runtime
/******/ 	__webpack_require__.oe = function(err) {
/******/ 		process.nextTick(function() {
/******/ 			throw err; // catch this error by using System.import().catch()
/******/ 		});
/******/ 	};
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets.json":
/***/ (function(module, exports) {

module.exports = require("./assets.json");

/***/ }),

/***/ "./node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./node_modules/postcss-loader/lib/index.js?{\"config\":{\"path\":\"./tools/postcss.config.js\"}}!./src/routes/error/ErrorPage.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-present Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\nhtml {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding: 0 32px;\n  padding: 0 2rem;\n  height: 100%;\n  font-family: sans-serif;\n  text-align: center;\n  color: #888;\n}\n\nbody {\n  margin: 0;\n}\n\nh1 {\n  font-weight: 400;\n  color: #555;\n}\n\npre {\n  white-space: pre-wrap;\n  text-align: left;\n}\n", "", {"version":3,"sources":["/home/aniket/iiit_study/ssad/polaris/src/routes/error/ErrorPage.css"],"names":[],"mappings":"AAAA;;;;;;;GAOG;;AAEH;EACE,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;EACd,0BAA0B;MACtB,uBAAuB;UACnB,oBAAoB;EAC5B,yBAAyB;MACrB,sBAAsB;UAClB,wBAAwB;EAChC,gBAAgB;EAChB,gBAAgB;EAChB,aAAa;EACb,wBAAwB;EACxB,mBAAmB;EACnB,YAAY;CACb;;AAED;EACE,UAAU;CACX;;AAED;EACE,iBAAiB;EACjB,YAAY;CACb;;AAED;EACE,sBAAsB;EACtB,iBAAiB;CAClB","file":"ErrorPage.css","sourcesContent":["/**\n * React Starter Kit (https://www.reactstarterkit.com/)\n *\n * Copyright © 2014-present Kriasoft, LLC. All rights reserved.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n\nhtml {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding: 0 32px;\n  padding: 0 2rem;\n  height: 100%;\n  font-family: sans-serif;\n  text-align: center;\n  color: #888;\n}\n\nbody {\n  margin: 0;\n}\n\nh1 {\n  font-weight: 400;\n  color: #555;\n}\n\npre {\n  white-space: pre-wrap;\n  text-align: left;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/isomorphic-style-loader/lib/insertCss.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stringify = __webpack_require__("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = __webpack_require__("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

var prefix = 's';
var inserted = {};

// Base64 encoding and decoding - The "Unicode Problem"
// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

/**
 * Remove style/link elements for specified node IDs
 * if they are no longer referenced by UI components.
 */
function removeCss(ids) {
  ids.forEach(function (id) {
    if (--inserted[id] <= 0) {
      var elem = document.getElementById(prefix + id);
      if (elem) {
        elem.parentNode.removeChild(elem);
      }
    }
  });
}

/**
 * Example:
 *   // Insert CSS styles object generated by `css-loader` into DOM
 *   var removeCss = insertCss([[1, 'body { color: red; }']]);
 *
 *   // Remove it from the DOM
 *   removeCss();
 */
function insertCss(styles) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$replace = _ref.replace,
      replace = _ref$replace === undefined ? false : _ref$replace,
      _ref$prepend = _ref.prepend,
      prepend = _ref$prepend === undefined ? false : _ref$prepend;

  var ids = [];
  for (var i = 0; i < styles.length; i++) {
    var _styles$i = (0, _slicedToArray3.default)(styles[i], 4),
        moduleId = _styles$i[0],
        css = _styles$i[1],
        media = _styles$i[2],
        sourceMap = _styles$i[3];

    var id = moduleId + '-' + i;

    ids.push(id);

    if (inserted[id]) {
      if (!replace) {
        inserted[id]++;
        continue;
      }
    }

    inserted[id] = 1;

    var elem = document.getElementById(prefix + id);
    var create = false;

    if (!elem) {
      create = true;

      elem = document.createElement('style');
      elem.setAttribute('type', 'text/css');
      elem.id = prefix + id;

      if (media) {
        elem.setAttribute('media', media);
      }
    }

    var cssText = css;
    if (sourceMap && typeof btoa === 'function') {
      // skip IE9 and below, see http://caniuse.com/atob-btoa
      cssText += '\n/*# sourceMappingURL=data:application/json;base64,' + b64EncodeUnicode((0, _stringify2.default)(sourceMap)) + '*/';
      cssText += '\n/*# sourceURL=' + sourceMap.file + '?' + id + '*/';
    }

    if ('textContent' in elem) {
      elem.textContent = cssText;
    } else {
      elem.styleSheet.cssText = cssText;
    }

    if (create) {
      if (prepend) {
        document.head.insertBefore(elem, document.head.childNodes[0]);
      } else {
        document.head.appendChild(elem);
      }
    }
  }

  return removeCss.bind(null, ids);
}

module.exports = insertCss;

/***/ }),

/***/ "./src/api/Download/index.js":
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__("express");

const router = express.Router();

router.get('/download', (req, res, next) => {
		const fileName = `./csvFiles/${req.query.testName}.csv`;
		res.download(fileName);
		res.status(200);
});
router.get('/pdf', (req, res, next) => {
		var phantom = __webpack_require__("phantom");
		var l = '';
		phantom.create().then(function (ph) {
				ph.createPage().then(function (page) {
						page.open(req.body.link).then(function (status) {
								l = './pdfFiles/' + req.body.link;
								page.render(l).then(function () {
										console.log('Page Rendered');
										ph.exit();
								});
						});
				});
		});
		res.status(200);
		res.download(l);
});
module.exports = router;

/***/ }),

/***/ "./src/api/allIndiaMarksAnalysisReport/allIndiaMarksAnalysisReport.model.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__("mongoose");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);

// import {registerEvents} from './student.events';

const ReportSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  campusId: { type: String, required: true },

  phyMarks120: { type: Number, default: 0 },
  cheMarks120: { type: Number, default: 0 },
  matMarks120: { type: Number, default: 0 },

  phyRank: { type: Number, default: 0 },
  cheRank: { type: Number, default: 0 },
  matRank: { type: Number, default: 0 },

  overallMarks: { type: Number, default: 0 },
  overallRank: { type: Number, default: 0 },

  active: Boolean
});

const AllIndiaMarksAnalysisReportSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  testId: { type: String, required: true },
  academicYear: { type: Number, required: true },
  reports: [ReportSchema],
  active: Boolean
});

// registerEvents(studentSchema);
/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('AllIndiaMarksAnalysisReport', AllIndiaMarksAnalysisReportSchema));

/***/ }),

/***/ "./src/api/campusTopper/campusTopper.controller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["topper"] = topper;
/* harmony export (immutable) */ __webpack_exports__["campusTopper"] = campusTopper;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__ = __webpack_require__("./src/api/masterResult/masterResult.model.js");


function topper(req, res, next) {
  __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__["a" /* default */].find({}, (err, marks) => {
    const senddata = [];
    const campuses = [];
    const numberOfStudents = [];
    let cl = 0;
    const final = [];
    const students = [];
    let stucount = 0;
    for (let i = 0; i < marks.length; i++) {
      let flagstu = 0;
      for (let p = 0; p < stucount; p++) {
        if (marks[i].rollNumber == students[p]) {
          flagstu = 1;
          break;
        } else {
          continue;
        }
      }
      if (flagstu == 1) {
        continue;
      }
      students[stucount++] = marks[i].rollNumber;
      let flag = 0;
      let j = 0;
      for (j = 0; j < cl; j++) {
        if (campuses[j] == marks[i].campusId) {
          flag = 1;
          break;
        } else {
          continue;
        }
      }
      if (flag == 1) {
        senddata[j].physics.push({
          marks: marks[i].markAnalysis.Physics.obtainedMarks,
          name: marks[i].name
        });
        senddata[j].chemistry.push({
          marks: marks[i].markAnalysis.Chemistry.obtainedMarks,
          name: marks[i].name
        });
        senddata[j].maths.push({
          marks: marks[i].markAnalysis.Maths.obtainedMarks,
          name: marks[i].name
        });
      } else {
        campuses[cl] = marks[i].campusId;
        cl += 1;
        senddata[j] = {
          Name: '',
          physics: [{ marks: [], name: '' }],
          chemistry: [{ marks: [], name: '' }],
          maths: [{ marks: [], name: '' }]
        };
        senddata[j].Name = marks[i].campusId;
        senddata[j].physics.push({
          marks: marks[i].markAnalysis.Physics.obtainedMarks,
          name: marks[i].name
        });
        senddata[j].chemistry.push({
          marks: marks[i].markAnalysis.Chemistry.obtainedMarks,
          name: marks[i].name
        });
        senddata[j].maths.push({
          marks: marks[i].markAnalysis.Maths.obtainedMarks,
          name: marks[i].name
        });
      }
    }
    var finalData = [{ campus_name: "", student_name: "", subject: "", marks: 0 }];
    for (let i = 0; i < cl; i++) {
      final[i] = { campusName: '', physics: [], chemistry: [], maths: [] };
      final[i].campusName = campuses[i];
      senddata[i].physics.sort((a, b) => a.marks - b.marks);
      senddata[i].chemistry.sort((a, b) => a.marks - b.marks);
      senddata[i].maths.sort((a, b) => a.marks - b.marks);
      let k = 0;
      for (let j = senddata[i].physics.length - 1; j >= senddata[i].physics.length - 5; j--) {
        final[i].physics[k] = senddata[i].physics[j];
        final[i].chemistry[k] = senddata[i].chemistry[j];
        final[i].maths[k] = senddata[i].maths[j];
        finalData.push({ campus_name: campuses[i], student_name: senddata[i].physics[j].name, subject: "Physics", marks: senddata[i].physics[j].marks });
        k++;
      }
      for (let j = senddata[i].physics.length - 1; j >= senddata[i].physics.length - 5; j--) {
        finalData.push({ campus_name: campuses[i], student_name: senddata[i].chemistry[j].name, subject: "Chemistry", marks: senddata[i].chemistry[j].marks });
      }
      for (let j = senddata[i].physics.length - 1; j >= senddata[i].physics.length - 5; j--) {
        finalData.push({ campus_name: campuses[i], student_name: senddata[i].maths[j].name, subject: "Mathematics", marks: senddata[i].maths[j].marks });
      }

      // console.log(finalData);
    }
    finalData.splice(0, 1);
    const testNames = [];
    let test = 0;
    let tflag = 0;
    for (let i = 0; i < marks.length; i++) {
      // console.log("Hello");
      tflag = 0;
      for (let j = 0; j < test; j++) {
        if (marks[i].testName == testNames[j]) {
          tflag = 1;
          break;
        } else {
          continue;
        }
      }
      if (!tflag) {
        // console.log("2nd if");
        testNames[test] = marks[i].testName;
        test++;
        // console.log('test' + test);
      }
    }
    const csvFile = __webpack_require__("csv-file-creator");
    for (let k = 0; k < test; k++) {
      let l = 1;
      const data = [['Campus Name', 'Name', 'Subject', 'Subject Rank', 'Subject Marks']];
      data[0] = ['Campus Name', 'Name', 'Subject', 'Subject Rank', 'Subject Marks'];
      for (let i = 0; i < cl; i++) {
        for (let j = 0; j < 5; j++) {
          data[l++] = [final[i].campusName, final[i].physics[j].name, 'Physics', j + 1, final[i].physics[j].marks];
        }
        for (let j = 0; j < 5; j++) {
          data[l++] = [final[i].campusName, final[i].chemistry[j].name, 'Chemistry', j + 1, final[i].chemistry[j].marks];
        }
        for (let j = 0; j < 5; j++) {
          data[l++] = [final[i].campusName, final[i].maths[j].name, 'Maths', j + 1, final[i].maths[j].marks];
        }
      }
      const name = `./csvFiles/${testNames[k]}_Campus_Subject_Topper.csv`;
      csvFile(name, data);
    }

    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      // console.log(final);
      res.status(200).send(finalData);
    }
  });
}
function campusTopper(req, res, next) {
  __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__["a" /* default */].find({}, (err, marks) => {
    const senddata = [];
    const campuses = [];
    const numberOfStudents = [];
    let cl = 0;
    const final = [];
    const students = [];
    let stucount = 0;
    for (let i = 0; i < marks.length; i++) {
      let flagstu = 0;
      for (let p = 0; p < stucount; p++) {
        if (marks[i].rollNumber == students[p]) {
          flagstu = 1;
          break;
        } else {
          continue;
        }
      }
      if (flagstu == 1) {
        continue;
      }
      students[stucount++] = marks[i].rollNumber;
      let flag = 0;
      let j = 0;
      for (j = 0; j < cl; j++) {
        if (campuses[j] == marks[i].campusId) {
          flag = 1;
          break;
        } else {
          continue;
        }
      }
      if (flag == 1) {
        senddata[j].total.push({
          name: marks[i].name,
          marks: marks[i].markAnalysis.overall.obtainedMarks,
          physics: marks[i].markAnalysis.Physics.obtainedMarks,
          chemistry: marks[i].markAnalysis.Chemistry.obtainedMarks,
          maths: marks[i].markAnalysis.Maths.obtainedMarks
        });
      } else {
        campuses[cl] = marks[i].campusId;
        cl += 1;
        senddata[j] = {
          Name: '',
          total: [{ name: '', marks: [], physics: '', chemistry: '', maths: '' }]
        };
        senddata[j].Name = marks[i].campusId;
        senddata[j].total.push({
          name: marks[i].name,
          marks: marks[i].markAnalysis.overall.obtainedMarks,
          physics: marks[i].markAnalysis.Physics.obtainedMarks,
          chemistry: marks[i].markAnalysis.Chemistry.obtainedMarks,
          maths: marks[i].markAnalysis.Maths.obtainedMarks
        });
      }
    }
    var finalData = [{ campus_name: "", student_name: "", rank: 0, physics: 0, chemistry: 0, maths: 0, total: 0 }];
    for (let i = 0; i < cl; i++) {
      final[i] = { campusName: '', topper: [{ rank: '', total: '' }] };
      final[i].campusName = campuses[i];
      senddata[i].total.sort((a, b) => b.marks - a.marks);
      let k = 0;
      final[i].topper.pop();
      for (let j = 0; j < 5; j++) {
        final[i].topper.push({ rank: j + 1, total: senddata[i].total[j] });
        k++;
        finalData.push({ campus_name: campuses[i], student_name: final[i].topper[j].total.name, rank: j + 1, physics: final[i].topper[j].total.physics, chemistry: final[i].topper[j].total.chemistry, maths: final[i].topper[j].total.maths, total: final[i].topper[j].total.marks });
      }
    }
    const testNames = [];
    let test = 0;
    let tflag = 0;
    for (let i = 0; i < marks.length; i++) {
      // console.log("Hello");
      tflag = 0;
      for (let j = 0; j < test; j++) {
        if (marks[i].testName == testNames[j]) {
          tflag = 1;
          break;
        } else {
          continue;
        }
      }
      if (!tflag) {
        // console.log("2nd if");
        testNames[test] = marks[i].testName;
        test++;
        // console.log('test' + test);
      }
    }
    const csvFile = __webpack_require__("csv-file-creator");
    for (let k = 0; k < test; k++) {
      let l = 1;
      const data = [['Campus Name', 'Rank', 'Name', 'Total Marks', 'Physics Marks', 'Chemistry Marks', 'Maths Marks']];
      data[0] = ['Campus Name', 'Rank', 'Name', 'Total Marks', 'Physics Marks', 'Chemistry Marks', 'Maths Marks'];
      for (let i = 0; i < cl; i++) {
        for (let j = 0; j < 5; j++) {
          data[l++] = [final[i].campusName, final[i].topper[j].rank, final[i].topper[j].total.name, final[i].topper[j].total.marks, final[i].topper[j].total.physics, final[i].topper[j].total.chemistry, final[i].topper[j].total.maths];
        }
      }
      const name = `./csvFiles/${testNames[k]}_Campus_Topper.csv`;
      csvFile(name, data);
    }
    finalData.splice(0, 1);
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      // console.log(final);
      res.status(200).send(finalData);
    }
  });
}
/* harmony default export */ __webpack_exports__["default"] = ({
  topper,
  campusTopper
});

/***/ }),

/***/ "./src/api/campusTopper/index.js":
/***/ (function(module, exports, __webpack_require__) {

const controller = __webpack_require__("./src/api/campusTopper/campusTopper.controller.js");
const express = __webpack_require__("express");

const router = express.Router();

router.get('/topper', controller.topper);
router.get('/campusTopper', controller.campusTopper);
module.exports = router;

/***/ }),

/***/ "./src/api/cwuAnalysisReport/cwuAnalysisReport.model.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__("mongoose");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);

// import {registerEvents} from './student.events';

const ReportSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  campusId: { type: String, required: true },

  Physics_C: { type: Number, default: 0 },
  Physics_W: { type: Number, default: 0 },
  Physics_U: { type: Number, default: 0 },

  Chemistry_C: { type: Number, default: 0 },
  Chemistry_W: { type: Number, default: 0 },
  Chemistry_U: { type: Number, default: 0 },

  Maths_C: { type: Number, default: 0 },
  Maths_W: { type: Number, default: 0 },
  Maths_U: { type: Number, default: 0 },

  active: Boolean
});

const CWUAnalysisReportSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  testId: { type: String, required: true },
  academicYear: { type: Number, required: true },
  reports: [ReportSchema],
  active: Boolean
});

// registerEvents(studentSchema);
/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('CWUAnalysisReport', CWUAnalysisReportSchema));

/***/ }),

/***/ "./src/api/fetchDetails/fetchDetails.controller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["getAllCampuses"] = getAllCampuses;
/* harmony export (immutable) */ __webpack_exports__["getAllSections"] = getAllSections;
/* harmony export (immutable) */ __webpack_exports__["getStudentNames"] = getStudentNames;
/* harmony export (immutable) */ __webpack_exports__["getStudentDetails"] = getStudentDetails;
/* harmony export (immutable) */ __webpack_exports__["data"] = data;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__ = __webpack_require__("./src/api/masterResult/masterResult.model.js");


function getAllCampuses(marks) {
  const campuses = [];
  let cl = 0;
  for (let i = 0; i < marks.length; i++) {
    let flag = 0;
    let j = 0;
    for (j = 0; j < cl; j++) {
      if (campuses[j] == marks[i].campusId) {
        flag = 1;
        break;
      } else {
        continue;
      }
    }
    if (flag == 1) {} else {
      campuses[cl] = marks[i].campusId;
      cl += 1;
    }
  }
  // for (let i = 0;i<campuses.length;i++)
  // {
  // 	console.log(campuses[i] + 'inside campuses');
  // }
  return campuses;
}
function getAllSections(campus, marks) {
  let numSec = 0;
  const sections = [];
  for (let i = 0; i < marks.length; i++) {
    let flag = 0;
    if (marks[i].campusId == campus) {
      flag = 1;
    } else {
      continue;
    }
    if (flag == 1) {
      let flagSec = 0;
      let k = 0;
      for (k = 0; k < numSec; k++) {
        if (marks[i].sectionId == sections[k]) {
          flagSec = 1;
          break;
        }
      }
      if (flagSec == 0) {
        sections[numSec] = marks[i].sectionId;
        numSec += 1;
      }
    }
  }
  // sections.shift();
  //    for(let i = 0;i<sections.length;i++)
  // {
  // 	console.log(sections[i] + 'inside function');
  // }
  return sections;
}
function getStudentNames(campus, section, marks) {
  let numStu = 0;
  const students = [];
  for (let i = 0; i < marks.length; i++) {
    let flag = 0;
    if (marks[i].campusId == campus && marks[i].sectionId == section) {
      flag = 1;
    } else {
      continue;
    }
    if (flag == 1) {
      let flagStu = 0;
      let k = 0;
      for (k = 0; k < numStu; k++) {
        if (marks[i].rollNumber == students[k]) {
          flagStu = 1;
          break;
        }
      }
      if (flagStu == 0) {
        students[numStu] = marks[i].rollNumber;
        numStu += 1;
      }
    }
  }
  // students.shift();
  for (let i = 0; i < students.length; i++) {
    console.log(`${students[i]}inside function`);
  }
  return students;
}
function getStudentDetails(roll, marks) {
  const studentDetails = { rollNumber: '', name: '', campus: '', section: '' };

  for (let i = 0; i < marks.length; i++) {
    if (marks[i].rollNumber == roll) {
      studentDetails.rollNumber = marks[i].rollNumber;
      studentDetails.name = marks[i].name;
      studentDetails.campus = marks[i].campusId;
      studentDetails.section = marks[i].sectionId;
    }
  }
  // console.log('inside function' + studentDetails.campus);
  return studentDetails;
}
function data(req, res, next) {
  __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__["a" /* default */].find({}, (err, marks) => {
    const allData = {
      campuses: [],
      sections: [],
      students: [],
      studentDetails: { rollNumber: '', name: '', campus: '', section: '' }
    };
    if (!req.body.campus) {
      // campus name is NULL
      allData.campuses = getAllCampuses(marks);
      // for(let i = 0;i<allData.campuses.length;i++)
      // {
      // 	console.log(allData.campuses[i]);
      // }
    } else if (!req.body.section) {
      // campus name is not NULL and section name is NULL
      var campus = req.body.campus;
      allData.sections = getAllSections(campus, marks);
      // for(let i = 0;i<allData.sections.length;i++)
      // {
      // 	console.log(allData.sections[i]);
      // }
    } else if (!req.body.rollno) {
      // campus name and section name are both not null and student roll number is null
      var campus = req.body.campus;
      const section = req.body.section;
      allData.students = getStudentNames(campus, section, marks);
    } else {
      const roll = req.body.roll;
      allData.studentDetails = getStudentDetails(roll, marks);
      // console.log('inside main' + allData.studentDetails.campus);
    }
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(allData);
    }
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({
  data,
  getAllCampuses,
  getAllSections
});

/***/ }),

/***/ "./src/api/fetchDetails/index.js":
/***/ (function(module, exports, __webpack_require__) {

const controller = __webpack_require__("./src/api/fetchDetails/fetchDetails.controller.js");
const express = __webpack_require__("express");

const router = express.Router();
router.get('/data', controller.data);
module.exports = router;

/***/ }),

/***/ "./src/api/filesList/filesList.controller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["getList"] = getList;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__filesList_model__ = __webpack_require__("./src/api/filesList/filesList.model.js");


function getList(req, res) {
  __WEBPACK_IMPORTED_MODULE_0__filesList_model__["a" /* default */].find({}, (err, docs) => {
    const a = [];
    console.log(docs.length);
    for (let i = 0; i < docs.length; i += 2) {
      const files = { testname: '', date: '', check: '' };
      files.testname = docs[i].testname;
      // files.filename = docs[i].filename;
      // console.log(i);
      files.date = docs[i].dateuploaded.toLocaleDateString();
      files.check = true;
      a.push(files);
      // console.log(files.date);
    }

    const senddata = { filedetails: a, allResults: [] };
    senddata.allResults.push(['Overall Average across all Campuses', '/api/overAllAverages/total']);
    senddata.allResults.push(['Overall Average across a particular Campus', '/api/overAllAverages/campus']);
    senddata.allResults.push(['Subject topper across a particular Campus', '/api/campusToppers/topper']);
    senddata.allResults.push(['Overall topper across a particular Campus', '/api/campusToppers/campusTopper']);
    senddata.allResults.push(['Overall Average across a particular Section', '/api/sectionAverages/section']);
    senddata.allResults.push(['Overall topper across a particular Section', '/api/sectionAverages/sectionToppers']);
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(senddata);
    }
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({
  getList
});
//

/***/ }),

/***/ "./src/api/filesList/filesList.model.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__("mongoose");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);


const FilesListSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  filename: { type: String, required: true },
  testname: { type: String, required: true },
  dateuploaded: { type: Date, required: true },
  check: { type: Boolean, required: true },
  active: Boolean
});
/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('FilesList', FilesListSchema));

/***/ }),

/***/ "./src/api/filesList/index.js":
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__("express");
const controller = __webpack_require__("./src/api/filesList/filesList.controller.js");

const router = express.Router();

router.get('/getList', controller.getList);
module.exports = router;

/***/ }),

/***/ "./src/api/getData/getData.controller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["allData"] = allData;
/* harmony export (immutable) */ __webpack_exports__["campusData"] = campusData;
/* harmony export (immutable) */ __webpack_exports__["sectionData"] = sectionData;
/* harmony export (immutable) */ __webpack_exports__["studentData"] = studentData;
/* harmony export (immutable) */ __webpack_exports__["fetchData"] = fetchData;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__ = __webpack_require__("./src/api/masterResult/masterResult.model.js");


function allData(marks) {
  const senddata = {
    physics: { correct: 0, incorrect: 0, unattempted: 0 },
    chemistry: { correct: 0, incorrect: 0, unattempted: 0 },
    maths: { correct: 0, incorrect: 0, unattempted: 0 }
  };
  for (let i = 0; i < marks.length; i++) {
    senddata.physics.correct += marks[i].cwuAnalysis.Physics_C;
    senddata.physics.incorrect += marks[i].cwuAnalysis.Physics_W;
    senddata.physics.unattempted += marks[i].cwuAnalysis.Physics_U;
    senddata.chemistry.correct += marks[i].cwuAnalysis.Chemistry_C;
    senddata.chemistry.incorrect += marks[i].cwuAnalysis.Chemistry_W;
    senddata.chemistry.unattempted += marks[i].cwuAnalysis.Chemistry_U;
    senddata.maths.correct += marks[i].cwuAnalysis.Maths_C;
    senddata.maths.incorrect += marks[i].cwuAnalysis.Maths_W;
    senddata.maths.unattempted += marks[i].cwuAnalysis.Maths_U;
  }
  const finalData = [{ value: 0, name: '', group: '' }];
  finalData.push({
    value: Math.round(senddata.physics.correct / marks.length),
    name: 'Correct',
    group: 'Physics'
  });
  finalData.push({
    value: Math.round(senddata.physics.incorrect / marks.length),
    name: 'Incorrect',
    group: 'Physics'
  });
  finalData.push({
    value: Math.round(senddata.physics.unattempted / marks.length),
    name: 'Unattempted',
    group: 'Physics'
  });
  finalData.push({
    value: Math.round(senddata.chemistry.correct / marks.length),
    name: 'Correct',
    group: 'Chemistry'
  });
  finalData.push({
    value: Math.round(senddata.chemistry.incorrect / marks.length),
    name: 'Incorrect',
    group: 'Chemistry'
  });
  finalData.push({
    value: Math.round(senddata.chemistry.unattempted / marks.length),
    name: 'Unattempted',
    group: 'Chemistry'
  });
  finalData.push({
    value: Math.round(senddata.maths.correct / marks.length),
    name: 'Correct',
    group: 'Maths'
  });
  finalData.push({
    value: Math.round(senddata.maths.incorrect / marks.length),
    name: 'Incorrect',
    group: 'Maths'
  });
  finalData.push({
    value: Math.round(senddata.maths.unattempted / marks.length),
    name: 'Unattempted',
    group: 'Maths'
  });
  finalData.splice(0, 1);
  return finalData;
}
function campusData(campusName, marks) {
  const senddata = {
    physics: { correct: 0, incorrect: 0, unattempted: 0 },
    chemistry: { correct: 0, incorrect: 0, unattempted: 0 },
    maths: { correct: 0, incorrect: 0, unattempted: 0 }
  };
  let count = 0;
  for (let i = 0; i < marks.length; i++) {
    if (marks[i].campusId === campusName) {
      senddata.physics.correct += marks[i].cwuAnalysis.Physics_C;
      senddata.physics.incorrect += marks[i].cwuAnalysis.Physics_W;
      senddata.physics.unattempted += marks[i].cwuAnalysis.Physics_U;
      senddata.chemistry.correct += marks[i].cwuAnalysis.Chemistry_C;
      senddata.chemistry.incorrect += marks[i].cwuAnalysis.Chemistry_W;
      senddata.chemistry.unattempted += marks[i].cwuAnalysis.Chemistry_U;
      senddata.maths.correct += marks[i].cwuAnalysis.Maths_C;
      senddata.maths.incorrect += marks[i].cwuAnalysis.Maths_W;
      senddata.maths.unattempted += marks[i].cwuAnalysis.Maths_U;
      count++;
    }
  }
  const finalData = [{ value: 0, name: '', group: '' }];
  finalData.push({
    value: Math.round(senddata.physics.correct / count),
    name: 'Correct',
    group: 'Physics'
  });
  finalData.push({
    value: Math.round(senddata.physics.incorrect / count),
    name: 'Incorrect',
    group: 'Physics'
  });
  finalData.push({
    value: Math.round(senddata.physics.unattempted / count),
    name: 'Unattempted',
    group: 'Physics'
  });
  finalData.push({
    value: Math.round(senddata.chemistry.correct / count),
    name: 'Correct',
    group: 'Chemistry'
  });
  finalData.push({
    value: Math.round(senddata.chemistry.incorrect / count),
    name: 'Incorrect',
    group: 'Chemistry'
  });
  finalData.push({
    value: Math.round(senddata.chemistry.unattempted / count),
    name: 'Unattempted',
    group: 'Chemistry'
  });
  finalData.push({
    value: Math.round(senddata.maths.correct / count),
    name: 'Correct',
    group: 'Maths'
  });
  finalData.push({
    value: Math.round(senddata.maths.incorrect / count),
    name: 'Incorrect',
    group: 'Maths'
  });
  finalData.push({
    value: Math.round(senddata.maths.unattempted / count),
    name: 'Unattempted',
    group: 'Maths'
  });
  console.log(count);
  finalData.splice(0, 1);
  return finalData;
}
function sectionData(sectionName, campusName, marks) {
  const senddata = {
    physics: { correct: 0, incorrect: 0, unattempted: 0 },
    chemistry: { correct: 0, incorrect: 0, unattempted: 0 },
    maths: { correct: 0, incorrect: 0, unattempted: 0 }
  };
  let count = 0;
  for (let i = 0; i < marks.length; i++) {
    if (marks[i].sectionId === sectionName && marks[i].campusId === campusName) {
      senddata.physics.correct += marks[i].cwuAnalysis.Physics_C;
      senddata.physics.incorrect += marks[i].cwuAnalysis.Physics_W;
      senddata.physics.unattempted += marks[i].cwuAnalysis.Physics_U;
      senddata.chemistry.correct += marks[i].cwuAnalysis.Chemistry_C;
      senddata.chemistry.incorrect += marks[i].cwuAnalysis.Chemistry_W;
      senddata.chemistry.unattempted += marks[i].cwuAnalysis.Chemistry_U;
      senddata.maths.correct += marks[i].cwuAnalysis.Maths_C;
      senddata.maths.incorrect += marks[i].cwuAnalysis.Maths_W;
      senddata.maths.unattempted += marks[i].cwuAnalysis.Maths_U;
      count++;
    }
  }
  const finalData = [{ value: 0, name: '', group: '' }];
  finalData.push({
    value: Math.round(senddata.physics.correct / count),
    name: 'Correct',
    group: 'Physics'
  });
  finalData.push({
    value: Math.round(senddata.physics.incorrect / count),
    name: 'Incorrect',
    group: 'Physics'
  });
  finalData.push({
    value: Math.round(senddata.physics.unattempted / count),
    name: 'Unattempted',
    group: 'Physics'
  });
  finalData.push({
    value: Math.round(senddata.chemistry.correct / count),
    name: 'Correct',
    group: 'Chemistry'
  });
  finalData.push({
    value: Math.round(senddata.chemistry.incorrect / count),
    name: 'Incorrect',
    group: 'Chemistry'
  });
  finalData.push({
    value: Math.round(senddata.chemistry.unattempted / count),
    name: 'Unattempted',
    group: 'Chemistry'
  });
  finalData.push({
    value: Math.round(senddata.maths.correct / count),
    name: 'Correct',
    group: 'Maths'
  });
  finalData.push({
    value: Math.round(senddata.maths.incorrect / count),
    name: 'Incorrect',
    group: 'Maths'
  });
  finalData.push({
    value: Math.round(senddata.maths.unattempted / count),
    name: 'Unattempted',
    group: 'Maths'
  });
  console.log(count);
  finalData.splice(0, 1);
  return finalData;
}
function studentData(studentName, marks) {
  const senddata = {
    physics: { correct: 0, incorrect: 0, unattempted: 0 },
    chemistry: { correct: 0, incorrect: 0, unattempted: 0 },
    maths: { correct: 0, incorrect: 0, unattempted: 0 }
  };
  const count = 1;
  for (let i = 0; i < marks.length; i++) {
    if (marks[i].name === studentName) {
      senddata.physics.correct = marks[i].cwuAnalysis.Physics_C;
      senddata.physics.incorrect = marks[i].cwuAnalysis.Physics_W;
      senddata.physics.unattempted = marks[i].cwuAnalysis.Physics_U;
      senddata.chemistry.correct = marks[i].cwuAnalysis.Chemistry_C;
      senddata.chemistry.incorrect = marks[i].cwuAnalysis.Chemistry_W;
      senddata.chemistry.unattempted = marks[i].cwuAnalysis.Chemistry_U;
      senddata.maths.correct = marks[i].cwuAnalysis.Maths_C;
      senddata.maths.incorrect = marks[i].cwuAnalysis.Maths_W;
      senddata.maths.unattempted = marks[i].cwuAnalysis.Maths_U;
      break;
    }
  }
  const finalData = [{ value: 0, name: '', group: '' }];
  finalData.push({
    value: Math.round(senddata.physics.correct / count),
    name: 'Correct',
    group: 'Physics'
  });
  finalData.push({
    value: Math.round(senddata.physics.incorrect / count),
    name: 'Incorrect',
    group: 'Physics'
  });
  finalData.push({
    value: Math.round(senddata.physics.unattempted / count),
    name: 'Unattempted',
    group: 'Physics'
  });
  finalData.push({
    value: Math.round(senddata.chemistry.correct / count),
    name: 'Correct',
    group: 'Chemistry'
  });
  finalData.push({
    value: Math.round(senddata.chemistry.incorrect / count),
    name: 'Incorrect',
    group: 'Chemistry'
  });
  finalData.push({
    value: Math.round(senddata.chemistry.unattempted / count),
    name: 'Unattempted',
    group: 'Chemistry'
  });
  finalData.push({
    value: Math.round(senddata.maths.correct / count),
    name: 'Correct',
    group: 'Maths'
  });
  finalData.push({
    value: Math.round(senddata.maths.incorrect / count),
    name: 'Incorrect',
    group: 'Maths'
  });
  finalData.push({
    value: Math.round(senddata.maths.unattempted / count),
    name: 'Unattempted',
    group: 'Maths'
  });
  console.log(count);
  finalData.splice(0, 1);
  return finalData;
}
function fetchData(req, res, next) {
  console.dir(req);
  __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__["a" /* default */].find({}, (err, marks) => {
    const senddata = [];
    const campuses = [];
    const sections = [];
    const finalSec = [];
    const data = [];
    const cl = 0;

    const numSec = [];
    const final = [];
    const numberOfStudents = [];
    let finalData;
    if (!req.query.campus) {
      finalData = allData(marks);
    } else if (!req.query.section) {
      const campus = req.query.campus;
      finalData = campusData(campus, marks);
    } else if (!req.query.student) {
      const sectionName = req.query.section;
      const campusName = req.query.campus;
      finalData = sectionData(sectionName, campusName, marks);
    } else {
      const student_name = req.query.student;
      finalData = studentData(student_name, marks);
    }
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(finalData);
    }
  });
}
/* harmony default export */ __webpack_exports__["default"] = ({
  fetchData,
  allData,
  campusData,
  sectionData,
  studentData
});

/***/ }),

/***/ "./src/api/getData/index.js":
/***/ (function(module, exports, __webpack_require__) {

const controller = __webpack_require__("./src/api/getData/getData.controller.js");
const express = __webpack_require__("express");

const router = express.Router();
router.get('/fetchData', controller.fetchData);
module.exports = router;

/***/ }),

/***/ "./src/api/graphData/graphData.controller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["data"] = data;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__ = __webpack_require__("./src/api/masterResult/masterResult.model.js");


function data(req, res, next) {
  __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__["a" /* default */].find({}, (err, marks) => {
    const senddata = [];
    const students = [];
    let stucount = 0;
    for (let i = 0; i < marks.length; i++) {
      let flagstu = 0;
      for (let p = 0; p < stucount; p++) {
        if (marks[i].rollNumber == students[p]) {
          flagstu = 1;
          break;
        } else {
          continue;
        }
      }
      if (flagstu == 1) {
        continue;
      }
      students[stucount++] = marks[i].rollNumber;
      senddata.push({ campus_name: marks[i].campusId, section_name: marks[i].sectionId, student_name: marks[i].name, student_roll_number: marks[i].rollNumber });
    }
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      // console.log(final);
      res.status(200).send(senddata);
    }
  });
}
/* harmony default export */ __webpack_exports__["default"] = ({
  data
});

/***/ }),

/***/ "./src/api/graphData/index.js":
/***/ (function(module, exports, __webpack_require__) {

const controller = __webpack_require__("./src/api/graphData/graphData.controller.js");
const express = __webpack_require__("express");

const router = express.Router();

router.get('/data', controller.data);
module.exports = router;

/***/ }),

/***/ "./src/api/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * API
 */

// import path from 'path';
const student = __webpack_require__("./src/api/student/index.js");
const masterResult = __webpack_require__("./src/api/masterResult/index.js");
const overAllAverage = __webpack_require__("./src/api/overAllAverage/index.js");
const filesList = __webpack_require__("./src/api/filesList/index.js");
const sectionAverage = __webpack_require__("./src/api/sectionAverage/index.js");
const campusTopper = __webpack_require__("./src/api/campusTopper/index.js");
const fetchDetails = __webpack_require__("./src/api/fetchDetails/index.js");
const getData = __webpack_require__("./src/api/getData/index.js");
const Download = __webpack_require__("./src/api/Download/index.js");
const graphData = __webpack_require__("./src/api/graphData/index.js");

// const sectionTopper = require('./sectionTopper');
/* harmony default export */ __webpack_exports__["default"] = (function (app) {
  //  Insert API below
  // use the same naming convention
  app.use('/api/students', student);
  app.use('/api/masterResults', masterResult);
  app.use('/api/filesList', filesList);
  app.use('/api/overAllAverages', overAllAverage);
  app.use('/api/sectionAverages', sectionAverage);
  app.use('/api/campusToppers', campusTopper);
  app.use('/api/fetchDetails', fetchDetails);
  app.use('/api/getData', getData);
  app.use('/api/download', Download);
  app.use('/api/graphData', graphData);
});

/***/ }),

/***/ "./src/api/masterResult/index.js":
/***/ (function(module, exports, __webpack_require__) {

// import mongoose from 'mongoose';
// import FilesList from '../filesList/filesList.model';
const multer = __webpack_require__("multer");
const express = __webpack_require__("express");

const controller = __webpack_require__("./src/api/masterResult/masterResult.controller.js");

const router = express.Router();

const storage = multer.diskStorage({
  destination: './files',
  filename(req, file, cb) {
    cb(null, `${new Date()}-${file.originalname}`);
    // name(file);
  }
} // var Thing = mongoose.model('filesList', schema);
// var m = new Thing;
// m.filename = new Date();
// m.fileuploaded = file.originalname;
// m.save(callback);
);

const upload = multer({ storage });

// router.get('/', controller.index);
router.post('/populateDb', upload.array('files', 2), controller.readFiles, controller.createMasterResults, controller.cwuAnalysis, controller.markAnalysis, controller.rankAnalysis, controller.createFileDetails,
// controller.total,
controller.populateDb);
// router.get('/lol', controller.lol);

module.exports = router;

/***/ }),

/***/ "./src/api/masterResult/masterResult.controller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["index"] = index;
/* harmony export (immutable) */ __webpack_exports__["readFiles"] = readFiles;
/* harmony export (immutable) */ __webpack_exports__["createMasterResults"] = createMasterResults;
/* harmony export (immutable) */ __webpack_exports__["cwuAnalysis"] = cwuAnalysis;
/* harmony export (immutable) */ __webpack_exports__["markAnalysis"] = markAnalysis;
/* harmony export (immutable) */ __webpack_exports__["rankAnalysis"] = rankAnalysis;
/* harmony export (immutable) */ __webpack_exports__["createFileDetails"] = createFileDetails;
/* harmony export (immutable) */ __webpack_exports__["populateDb"] = populateDb;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__masterResult_model__ = __webpack_require__("./src/api/masterResult/masterResult.model.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__filesList_filesList_model__ = __webpack_require__("./src/api/filesList/filesList.model.js");
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/students              ->  index
 * POST    /api/students              ->  create
 * GET     /api/students/:id          ->  show
 * PUT     /api/students/:id          ->  upsert
 * PATCH   /api/students/:id          ->  patch
 * DELETE  /api/students/:id          ->  destroy
 */




const fs = __webpack_require__("fs");
const csvjson = __webpack_require__("csvjson");
// Gets a list of Students
function index(req, res) {
  __WEBPACK_IMPORTED_MODULE_0__masterResult_model__["a" /* default */].find({}, (err, docs) => {
    res.status(200).send(docs);
  });
}

function getQuestionResponse(errorData) {
  const response = {};
  // let totalNumberQuestion = 0;

  // for (const key in error_data) {
  //   if(key.match(/^[Q]\d*/g)){
  //     total_no_question += 1
  //     response[key] = error_data[key]
  //   }
  // }

  Object.keys(errorData).forEach(key => {
    if (key.match(/^[Q]\d*/g)) {
      // totalNumberQuestion += 1;
      response[key] = errorData[key];
    }
  });

  return response;
}

function getQuestionWiseResponseMarks(errorData, Qmap) {
  const response = {};
  // let totalNumberQuestion = 0;

  // for (const key in error_data) {
  //   if(key.match(/^[Q]\d*/g)){
  //     total_no_question += 1
  //     response[key] = error_data[key]
  //   }
  // }

  Object.keys(errorData).forEach(key => {
    if (key.match(/^[Q]\d*/g)) {
      // totalNumberQuestion += 1;
      const tmpQmap = Qmap[key];
      response[key] = tmpQmap[errorData[key]];
    }
  });

  return response;
}

function getStudent(errorData, Qmap) {
  const result = {};

  result.rollNumber = errorData.STU_ID;
  result.name = errorData.NAME_OF_THE_STUDENT;
  result.campusId = errorData.CAMPUS_ID;
  result.sectionId = errorData.SECTION_ID;

  result.questionResponse = getQuestionResponse(errorData);
  result.questionMarks = getQuestionWiseResponseMarks(errorData, Qmap);
  return result;
}

function getQmap(markingSchemaData) {
  const Q = {};

  for (let l = 0; l < markingSchemaData.length; l += 1) {
    Q[markingSchemaData[l].Qs] = {
      C: markingSchemaData[l].C,
      W: markingSchemaData[l].U,
      U: markingSchemaData[l].W,
      ADD: markingSchemaData[l].ADD,
      subject: markingSchemaData[l].SUBJECT,
      topic: markingSchemaData[l].TOPIC,
      // sub_topic: markingSchemaData[l].SUB-TOPIC,
      concept: markingSchemaData[l].CONCEPT
    };
  }

  return Q;
}

function getSubjects(markingSchemaData) {
  const subjects = [];

  for (let l = 0; l < markingSchemaData.length; l += 1) {
    if (!(markingSchemaData[l].SUBJECT in subjects)) {
      subjects.push(markingSchemaData[l].SUBJECT);
    }
  }

  const uSet = new Set(subjects);
  const uniqueSubjects = Array.from(uSet);
  return uniqueSubjects;
}

function readFiles(req, res, next) {
  // console.log(req.files);
  const errorReportfile = req.files[0];
  const markingSchemafile = req.files[1]; // file passed from client

  // const meta = req.body; // all other values passed from the client, like name, etc..

  // console.log("files: ", req.files[0]);

  const options = {
    delimiter: ',', // optional
    quote: '"' // optional
  };

  const errorReportFs = fs.readFileSync(errorReportfile.path, {
    encoding: 'utf8'
  });
  const markingSchemaFs = fs.readFileSync(markingSchemafile.path, {
    encoding: 'utf8'
  });

  const errorReportData = csvjson.toObject(errorReportFs, options);
  const markingSchemaData = csvjson.toObject(markingSchemaFs, options);

  req.errorReportData = errorReportData;
  req.markingSchemaData = markingSchemaData;
  req.Qmap = getQmap(markingSchemaData);
  req.subjects = getSubjects(markingSchemaData);
  next();
}

function createMasterResults(req, res, next) {
  const masterResults = [];
  for (let l = req.errorReportData.length - 1; l >= 0; l -= 1) {
    let result = {};
    result = getStudent(req.errorReportData[l], req.Qmap);
    result.Qmap = req.Qmap;
    result.testName = req.body.testname;
    // result.test_name = req.params.name;
    // result.date = req.params.date;
    // result.test_type = req.params.type;

    // result.test_id = generate_test_id(req.params.name, req.params.date, req.params.type);
    // console.log('section id' + result.sectionId);
    masterResults.push(result);
  }

  req.masterResults = masterResults;
  next();
}

function getCwuAnalysis(questionResponse, Qmap, subjects) {
  const cwu = {};

  Object.keys(subjects).forEach(key => {
    cwu[''.concat(subjects[key], '_C')] = 0;
    cwu[''.concat(subjects[key], '_W')] = 0;
    cwu[''.concat(subjects[key], '_U')] = 0;
    cwu[''.concat(subjects[key], '_ADD')] = 0;
  });

  Object.keys(Qmap).forEach(key => {
    const map = Qmap[key];
    if (questionResponse[key] === 'ADD') {
      cwu[''.concat(map.subject, '_C')] += 1;
    } else {
      cwu[''.concat(map.subject, '_', questionResponse[key])] += 1;
    }
  });

  return cwu;
}

function cwuAnalysis(req, res, next) {
  for (let l = 0; l < req.masterResults.length; l += 1) {
    req.masterResults[l].cwuAnalysis = getCwuAnalysis(req.masterResults[l].questionResponse, req.Qmap, req.subjects);
  }

  next();
}

function getSubjectMark(questionResponse, Qmap, subjectName) {
  const subjectMark = {};

  let obtainedMarks = 0;
  let totalMarks = 0;

  Object.keys(Qmap).forEach(key => {
    const map = Qmap[key];
    if (map.subject === subjectName) {
      obtainedMarks += parseInt(map[questionResponse[key]], 10);
      totalMarks += parseInt(map.C, 10);
    }
  });

  subjectMark.obtainedMarks = obtainedMarks;
  subjectMark.totalMarks = totalMarks;

  // console.log(subject_mark);

  return subjectMark;
}

function markAnalysis(req, res, next) {
  for (let l = 0; l < req.masterResults.length; l += 1) {
    const mark = {};
    const overall = {};
    overall.obtainedMarks = 0;
    overall.totalMarks = 0;

    for (let j = 0; j < req.subjects.length; j += 1) {
      const tmp = getSubjectMark(req.masterResults[l].questionResponse, req.masterResults[l].Qmap, req.subjects[j]);

      mark[req.subjects[j]] = tmp;
      overall.obtainedMarks += tmp.obtainedMarks;
      overall.totalMarks += tmp.totalMarks;
    }

    mark.overall = overall;
    req.masterResults[l].markAnalysis = mark;
  }

  next();
}

function rankAnalysis(req, res, next) {
  //  For each subject
  for (let l = 0; l < req.subjects.length; l += 1) {
    // req.subjects[l]
    req.masterResults.sort((a, b) => a.markAnalysis[req.subjects[l]].obtainedMarks - b.markAnalysis[req.subjects[l]].obtainedMarks);
    let skip = 1;
    let lastMark = req.masterResults[req.masterResults.length - 1].markAnalysis[req.subjects[l]].obtainedMarks;

    if (req.masterResults[req.masterResults.length - 1].rankAnalysis === undefined) {
      req.masterResults[req.masterResults.length - 1].rankAnalysis = {};
    }

    if (req.masterResults[req.masterResults.length - 1].rankAnalysis[req.subjects[l]] === undefined) {
      req.masterResults[req.masterResults.length - 1].rankAnalysis[req.subjects[l]] = {};
    }

    req.masterResults[req.masterResults.length - 1].rankAnalysis[req.subjects[l]].rank = 1;

    let lastRank = 1;

    for (let k = req.masterResults.length - 2; k >= 0; k -= 1) {
      if (req.masterResults[k].rankAnalysis === undefined) {
        req.masterResults[k].rankAnalysis = {};
      }
      if (req.masterResults[k].rankAnalysis[req.subjects[l]] === undefined) {
        req.masterResults[k].rankAnalysis[req.subjects[l]] = {};
      }

      if (req.masterResults[k].markAnalysis[req.subjects[l]].obtainedMarks === lastMark) {
        req.masterResults[k].rankAnalysis[req.subjects[l]].rank = lastRank;
        skip += 1;
      } else {
        req.masterResults[k].rankAnalysis[req.subjects[l]].rank = lastRank + skip;

        lastMark = req.masterResults[k].markAnalysis[req.subjects[l]].obtainedMarks;

        lastRank += skip;
        skip = 1;
      }
    }
  }

  // For Overll mark
  req.masterResults.sort((a, b) => a.markAnalysis.overall.obtainedMarks - b.markAnalysis.overall.obtainedMarks);

  let skip = 1;
  let lastMark = req.masterResults[req.masterResults.length - 1].markAnalysis.overall.obtainedMarks;

  if (req.masterResults[req.masterResults.length - 1].rankAnalysis === undefined) {
    req.masterResults[req.masterResults.length - 1].rankAnalysis = {};
  }

  if (req.masterResults[req.masterResults.length - 1].rankAnalysis.overall === undefined) {
    req.masterResults[req.masterResults.length - 1].rankAnalysis.overall = {};
  }

  req.masterResults[req.masterResults.length - 1].rankAnalysis.overall.rank = 1;

  let lastRank = 1;

  for (let k = req.masterResults.length - 2; k >= 0; k -= 1) {
    if (req.masterResults[k].rankAnalysis === undefined) {
      req.masterResults[k].rankAnalysis = {};
    }
    if (req.masterResults[k].rankAnalysis.overall === undefined) {
      req.masterResults[k].rankAnalysis.overall = {};
    }

    if (req.masterResults[k].markAnalysis.overall.obtainedMarks === lastMark) {
      req.masterResults[k].rankAnalysis.overall.rank = lastRank;
      skip += 1;
    } else {
      req.masterResults[k].rankAnalysis.overall.rank = lastRank + skip;

      lastMark = req.masterResults[k].markAnalysis.overall.obtainedMarks;

      lastRank += skip;
      skip = 1;
    }
  }

  // Let's go to populate db.
  next();
}
function createFileDetails(req, res, next) {
  const array = [];
  for (let i = 0; i < 2; ++i) {
    const csvfile = {};
    csvfile.filename = req.files[i].originalname;
    csvfile.testname = req.body.testname;
    csvfile.dateuploaded = new Date();
    csvfile.check = true;
    // allfiles.push(csvfile);
    array.push(csvfile);
  }
  __WEBPACK_IMPORTED_MODULE_1__filesList_filesList_model__["a" /* default */].create(array, err => {
    if (err) {
      console.error(err);
    }
  });
  // console.log(allfiles);

  next();
}
// export function total(req, res, next){
//   console.log("****************************");
//   console.log(req.masterResults[1].markAnalysis.overall.obtainedMarks);
//     console.log("****************************");
//   next();
// }
// Finally populate to db
function populateDb(req, res) {
  __WEBPACK_IMPORTED_MODULE_0__masterResult_model__["a" /* default */].create(req.masterResults, (err, docs) => {
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(docs);
    }
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({
  readFiles,
  createMasterResults,
  createFileDetails,
  cwuAnalysis,
  markAnalysis,
  rankAnalysis,
  // total,
  populateDb
});

/***/ }),

/***/ "./src/api/masterResult/masterResult.model.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__("mongoose");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);

// import {registerEvents} from './student.events';

const MasterResultSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  rollNumber: { type: String, required: true },
  name: { type: String, required: true },
  omrSheetId: { type: String, default: null },
  instituteId: { type: String, default: null },
  campusId: { type: String, default: null },
  sectionId: { type: String, default: null },
  batch: { type: String, default: null },
  courseType: { type: String, default: null },
  Qmap: {},
  questionResponse: {},
  questionMarks: {},
  cwuAnalysis: {},
  markAnalysis: {},
  rankAnalysis: {},
  active: Boolean,
  testName: { type: String, required: true }
});

// registerEvents(studentSchema);
/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('MasterResult', MasterResultSchema));

/***/ }),

/***/ "./src/api/overAllAverage/index.js":
/***/ (function(module, exports, __webpack_require__) {

const controller = __webpack_require__("./src/api/overAllAverage/overAllAverage.controller.js");
const express = __webpack_require__("express");

const router = express.Router();
router.get('/total', controller.total);
router.get('/campus', controller.campus);
module.exports = router;

/***/ }),

/***/ "./src/api/overAllAverage/overAllAverage.controller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["total"] = total;
/* harmony export (immutable) */ __webpack_exports__["campus"] = campus;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__ = __webpack_require__("./src/api/masterResult/masterResult.model.js");


const csvfile = __webpack_require__("csv-file-creator");

function total(req, res, next) {
  __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__["a" /* default */].find({}, (err, marks) => {
    const averageMarks = { total: 0, physics: 0, chemistry: 0, maths: 0 };
    console.log(averageMarks);
    for (let i = 0; i < marks.length; i++) {
      averageMarks.total += marks[i].markAnalysis.overall.obtainedMarks;
      averageMarks.maths += marks[i].markAnalysis.Maths.obtainedMarks;
      averageMarks.chemistry += marks[i].markAnalysis.Chemistry.obtainedMarks;
      averageMarks.physics += marks[i].markAnalysis.Physics.obtainedMarks;
    }
    averageMarks.total /= marks.length;
    averageMarks.maths /= marks.length;
    averageMarks.physics /= marks.length;
    averageMarks.chemistry /= marks.length;
    const csvfile = __webpack_require__("csv-file-creator");
    const testNames = [];
    let test = 0;
    let tflag = 0;
    for (let i = 0; i < marks.length; i++) {
      // console.log("Hello");
      tflag = 0;
      for (let j = 0; j < test; j++) {
        if (marks[i].testName == testNames[j]) {
          tflag = 1;
          break;
        } else {
          continue;
        }
      }
      if (!tflag) {
        // console.log("2nd if");
        testNames[test] = marks[i].testName;
        test++;
        // console.log('test' + test);
      }
    }
    for (let j = 0; j < test; j++) {
      const data = [['Total Average', 'Physics Average', 'Chemistry Average', 'Mathematics Average']];
      data[0] = ['Total Average', 'Physics Average', 'Chemistry Average', 'Mathematics Average'];
      data[1] = [Math.round(averageMarks.total), Math.round(averageMarks.physics), Math.round(averageMarks.chemistry), Math.round(averageMarks.maths)];
      const name = `./csvFiles/${testNames[j]}_Overall_Average.csv`;
      // console.log(data[1]);
      csvfile(name, data);
    }
    var arr = [];
    arr.push(averageMarks);
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(arr);
    }
  });
}
function campus(req, res, next) {
  __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__["a" /* default */].find({}, (err, marks) => {
    const senddata = [];
    const campuses = [];
    let cl = 0;
    const final = [];
    const numberOfStudents = [];
    const csvFile = __webpack_require__("csv-file-creator");
    const students = [];
    let stucount = 0;
    for (let i = 0; i < marks.length; i++) {
      let flagstu = 0;
      for (let p = 0; p < stucount; p++) {
        if (marks[i].rollNumber == students[p]) {
          flagstu = 1;
          break;
        } else {
          continue;
        }
      }
      if (flagstu == 1) {
        continue;
      }
      students[stucount++] = marks[i].rollNumber;
      let flag = 0;
      let j = 0;
      for (j = 0; j < cl; j++) {
        if (campuses[j] == marks[i].campusId) {
          flag = 1;
          break;
        } else {
          continue;
        }
      }
      if (flag == 1) {
        numberOfStudents[j] += 1;
        senddata[j].total += marks[i].markAnalysis.overall.obtainedMarks;
        senddata[j].physics += marks[i].markAnalysis.Physics.obtainedMarks;
        senddata[j].chemistry += marks[i].markAnalysis.Chemistry.obtainedMarks;
        senddata[j].maths += marks[i].markAnalysis.Maths.obtainedMarks;
        senddata[j].name = marks[i].campusId;
      } else {
        campuses[cl] = marks[i].campusId;
        numberOfStudents[j] = 1;
        senddata[j] = { total: 0, physics: 0, chemistry: 0, maths: 0 };
        cl += 1;
        senddata[j].total += marks[i].markAnalysis.overall.obtainedMarks;
        senddata[j].physics += marks[i].markAnalysis.Physics.obtainedMarks;
        senddata[j].chemistry += marks[i].markAnalysis.Chemistry.obtainedMarks;
        senddata[j].maths += marks[i].markAnalysis.Maths.obtainedMarks;
        senddata[j].name = marks[i].campusId;
      }
    }

    for (let i = 0; i < cl; i++) {
      // console.log(senddata[i]);
      // console.log(numberOfStudents[i]);
      final[i] = { total: 0, physics: 0, chemistry: 0, maths: 0, campus_name: 'test' };
      final[i].total = senddata[i].total / numberOfStudents[i];
      final[i].physics = senddata[i].physics / numberOfStudents[i];
      final[i].chemistry = senddata[i].chemistry / numberOfStudents[i];
      final[i].maths = senddata[i].maths / numberOfStudents[i];
      final[i].campus_name = campuses[i];
      // console.log(final[i]);
    }
    const testNames = [];
    let test = 0;
    let tflag = 0;
    for (let i = 0; i < marks.length; i++) {
      // console.log("Hello");
      tflag = 0;
      for (let j = 0; j < test; j++) {
        if (marks[i].testName == testNames[j]) {
          tflag = 1;
          break;
        } else {
          continue;
        }
      }
      if (!tflag) {
        // console.log("2nd if");
        testNames[test] = marks[i].testName;
        test++;
        // console.log('test' + test);
      }
    }

    // console.log(testNames[0]);
    for (let j = 0; j < test; j++) {
      const data = [['Campus Name', 'Total Average', 'Physics Average', 'Chemistry Average', 'Mathematics Average']];
      data[0] = ['Campus Name', 'Total Average', 'Physics Average', 'Chemistry Average', 'Mathematics Average'];
      console.log('Hello');
      for (let i = 0; i < cl; i++) {
        data[i + 1] = [campuses[i], final[i].total, final[i].physics, final[i].chemistry, final[i].maths];
      }
      const name = `./csvFiles/${testNames[j]}_Campus_Average.csv`;
      csvFile(name, data);
    }
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(final);
    }
  });
}
/* harmony default export */ __webpack_exports__["default"] = ({
  total,
  campus
});

/***/ }),

/***/ "./src/api/sectionAverage/index.js":
/***/ (function(module, exports, __webpack_require__) {

var require;const controller = __webpack_require__("./src/api/sectionAverage/sectionAverage.controller.js");
const express = __webpack_require__("express");

const router = express.Router();
const section = require;
router.get('/section', controller.section);
router.get('/sectionToppers', controller.sectionToppers);
module.exports = router;

/***/ }),

/***/ "./src/api/sectionAverage/sectionAverage.controller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["section"] = section;
/* harmony export (immutable) */ __webpack_exports__["sectionToppers"] = sectionToppers;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__ = __webpack_require__("./src/api/masterResult/masterResult.model.js");


function section(req, res, next) {
  __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__["a" /* default */].find({}, (err, marks) => {
    const senddata = [];
    const campuses = [];
    const sections = [];
    const finalSec = [];
    let cl = 0;

    const numSec = [];
    const final = [];
    const numberOfStudents = [];
    const students = [];
    let stucount = 0;
    for (let i = 0; i < marks.length; i++) {
      let flagstu = 0;
      for (let p = 0; p < stucount; p++) {
        if (marks[i].rollNumber == students[p]) {
          flagstu = 1;
          break;
        } else {
          continue;
        }
      }
      if (flagstu == 1) {
        continue;
      }
      students[stucount++] = marks[i].rollNumber;
      let flag = 0;
      let j = 0;

      for (j = 0; j < cl; j++) {
        if (campuses[j] == marks[i].campusId) {
          flag = 1;
          break;
        } else {
          continue;
        }
      }
      if (flag == 1) {
        let flagSec = 0;
        let k = 0;
        for (k = 0; k < numSec[j]; k++) {
          if (marks[i].sectionId == senddata[j].section[k].secName) {
            senddata[j].section[k].secTotal += marks[i].markAnalysis.overall.obtainedMarks;
            senddata[j].section[k].secPhysics += marks[i].markAnalysis.Physics.obtainedMarks;
            senddata[j].section[k].secChem += marks[i].markAnalysis.Chemistry.obtainedMarks;
            senddata[j].section[k].secMath += marks[i].markAnalysis.Maths.obtainedMarks;
            senddata[j].campusName = marks[i].campusId;
            senddata[j].section[k].numberOfStudents += 1;
            flagSec = 1;
          }
        }
        if (flagSec == 0) {
          // console.log('j = ' + j);
          // console.log('k = ' + k);
          // console.log(senddata[j]);

          senddata[j].section[k].secTotal += marks[i].markAnalysis.overall.obtainedMarks;
          senddata[j].section[k].secPhysics += marks[i].markAnalysis.Physics.obtainedMarks;
          senddata[j].section[k].secChem += marks[i].markAnalysis.Chemistry.obtainedMarks;
          senddata[j].section[k].secMath += marks[i].markAnalysis.Maths.obtainedMarks;
          // senddata[j].campusName = marks[i].campusId;
          senddata[j].section[k].numberOfStudents = 1;
          senddata[j].section[k].secName += marks[i].sectionId;

          numSec[j] += 1;
        }
      } else {
        campuses[cl] = marks[i].campusId;
        senddata[cl] = {
          campusName: '',
          section: [{
            secName: '',
            secTotal: 0,
            secChem: 0,
            secMath: 0,
            secPhysics: 0,
            numberOfStudents: 0
          }, {
            secName: '',
            secTotal: 0,
            secChem: 0,
            secMath: 0,
            secPhysics: 0,
            numberOfStudents: 0
          }, {
            secName: '',
            secTotal: 0,
            secChem: 0,
            secMath: 0,
            secPhysics: 0,
            numberOfStudents: 0
          }, {
            secName: '',
            secTotal: 0,
            secChem: 0,
            secMath: 0,
            secPhysics: 0,
            numberOfStudents: 0
          }, {
            secName: '',
            secTotal: 0,
            secChem: 0,
            secMath: 0,
            secPhysics: 0,
            numberOfStudents: 0
          }]
        };
        cl += 1;
        // senddata[cl-1][0].section.push({secName: marks[i].sectionId, secTotal:)
        senddata[cl - 1].section[0].secName = marks[i].sectionId;

        senddata[cl - 1].section[0].secTotal += marks[i].markAnalysis.overall.obtainedMarks;
        senddata[cl - 1].section[0].secPhysics += marks[i].markAnalysis.Physics.obtainedMarks;
        senddata[cl - 1].section[0].secChem += marks[i].markAnalysis.Chemistry.obtainedMarks;
        senddata[cl - 1].section[0].secMath += marks[i].markAnalysis.Maths.obtainedMarks;
        senddata[cl - 1].campusName = marks[i].campusId;

        //  	senddata[cl-1][0].numberOfStudents = 1;
        numSec[cl - 1] = 1;
      }
    }
    for (let i = 0; i < cl; i++) {
      for (let j = 0; j < numSec[i]; j++) {
        senddata[i].section[j].secTotal /= senddata[i].section[j].numberOfStudents;
        senddata[i].section[j].secPhysics /= senddata[i].section[j].numberOfStudents;
        senddata[i].section[j].secChem /= senddata[i].section[j].numberOfStudents;
        senddata[i].section[j].secMath /= senddata[i].section[j].numberOfStudents;
      }
    }
    const testNames = [];
    let test = 0;
    let tflag = 0;
    for (let i = 0; i < marks.length; i++) {
      // console.log("Hello");
      tflag = 0;
      for (let j = 0; j < test; j++) {
        if (marks[i].testName == testNames[j]) {
          tflag = 1;
          break;
        } else {
          continue;
        }
      }
      if (!tflag) {
        // console.log("2nd if");
        testNames[test] = marks[i].testName;
        test++;
        // console.log('test' + test);
      }
    }
    const csvFile = __webpack_require__("csv-file-creator");
    var finalData = [{ campus_name: "", section_name: "", total: 0, physics: 0, chemistry: 0, maths: 0, number_of_students: 0 }];
    for (let k = 0; k < test; k++) {
      let l = 1;
      const data = [['Campus Name', 'Section Name', 'Total Average', 'Physics Average', 'Chemistry Average', 'Maths Average']];
      data[0] = ['Campus Name', 'Section Name', 'Total Average', 'Physics Average', 'Chemistry Average', 'Maths Average'];

      for (let i = 0; i < cl; i++) {
        finalSec[i] = { campusName: '', sectionData: [] };
        // senddata[i].section.splice(0, 1);
        finalSec[i].campusName = senddata[i].campusName;
        for (let j = 0; j < numSec[i]; j++) {
          finalSec[i].sectionData.push(senddata[i].section[j]);
          //finalData.push({campus_name: finalSec[i].campusName,section_name: senddata[i].section[j].secName,total: Math.round(senddata[i].section[j].secTotal),physics: Math.round(senddata[i].section[j].secPhysics),chemistry: Math.round(senddata[i].section[j].secChem),maths: Math.round(senddata[i].section[j].secMath),number_of_students: senddata[i].section[j].numberOfStudents});
          data[l++] = [finalSec[i].campusName, senddata[i].section[j].secName, Math.round(senddata[i].section[j].secTotal), Math.round(senddata[i].section[j].secPhysics), Math.round(senddata[i].section[j].secChem), Math.round(senddata[i].section[j].secMath)];
        }
      }
      const name = `./csvFiles/${testNames[k]}_Section_Average.csv`;
      csvFile(name, data);
    }
    for (let i = 0; i < cl; i++) {
      for (let j = 0; j < numSec[i]; j++) {
        finalData.push({ campus_name: finalSec[i].campusName, section_name: senddata[i].section[j].secName, total: Math.round(senddata[i].section[j].secTotal), physics: Math.round(senddata[i].section[j].secPhysics), chemistry: Math.round(senddata[i].section[j].secChem), maths: Math.round(senddata[i].section[j].secMath), number_of_students: senddata[i].section[j].numberOfStudents });
      }
    }
    finalData.splice(0, 1);
    // console.log(finalSec[1] + 'finalsec');
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(finalData);
    }
  });
}

function sectionToppers(req, res, next) {
  __WEBPACK_IMPORTED_MODULE_0__masterResult_masterResult_model__["a" /* default */].find({}, (err, marks) => {
    const senddata = [];
    const campuses = [];
    const sections = [];
    const finalSec = [];
    let cl = 0;

    const numSec = [];
    const final = [];
    const numberOfStudents = [];
    const students = [];
    let stucount = 0;
    for (let i = 0; i < marks.length; i++) {
      let flagstu = 0;
      for (let p = 0; p < stucount; p++) {
        if (marks[i].rollNumber == students[p]) {
          flagstu = 1;
          break;
        } else {
          continue;
        }
      }
      if (flagstu == 1) {
        continue;
      }
      students[stucount++] = marks[i].rollNumber;
      let flag = 0;
      let j = 0;

      for (j = 0; j < cl; j++) {
        if (campuses[j] == marks[i].campusId) {
          flag = 1;
          break;
        } else {
          continue;
        }
      }
      if (flag == 1) {
        let flagSec = 0;
        let k = 0;
        for (k = 0; k < numSec[j]; k++) {
          if (marks[i].sectionId == senddata[j].section[k].secName) {
            senddata[j].section[k].toppers.push({
              stuTotal: marks[i].markAnalysis.overall.obtainedMarks,
              stuChem: marks[i].markAnalysis.Chemistry.obtainedMarks,
              stuMath: marks[i].markAnalysis.Maths.obtainedMarks,
              stuPhysics: marks[i].markAnalysis.Physics.obtainedMarks,
              stuName: marks[i].name
            });

            flagSec = 1;
          }
        }
        if (flagSec == 0) {
          senddata[j].section[k].toppers.push({
            stuTotal: marks[i].markAnalysis.overall.obtainedMarks,
            stuChem: marks[i].markAnalysis.Chemistry.obtainedMarks,
            stuMath: marks[i].markAnalysis.Maths.obtainedMarks,
            stuPhysics: marks[i].markAnalysis.Physics.obtainedMarks,
            stuName: marks[i].name
          });

          senddata[j].section[k].secName = marks[i].sectionId;

          numSec[j] += 1;
        }
      } else {
        campuses[cl] = marks[i].campusId;
        senddata[cl] = {
          campusName: '',
          section: [{
            secName: '',
            toppers: [{
              stuTotal: 0,
              stuChem: 0,
              stuMath: 0,
              stuPhysics: 0,
              stuName: ''
            }]
          }, {
            secName: '',
            toppers: [{
              stuTotal: 0,
              stuChem: 0,
              stuMath: 0,
              stuPhysics: 0,
              stuName: ''
            }]
          }, {
            secName: '',
            toppers: [{
              stuTotal: 0,
              stuChem: 0,
              stuMath: 0,
              stuPhysics: 0,
              stuName: ''
            }]
          }, {
            secName: '',
            toppers: [{
              stuTotal: 0,
              stuChem: 0,
              stuMath: 0,
              stuPhysics: 0,
              stuName: ''
            }]
          }, {
            secName: '',
            toppers: [{
              stuTotal: 0,
              stuChem: 0,
              stuMath: 0,
              stuPhysics: 0,
              stuName: ''
            }]
          }]
        };
        cl += 1;
        senddata[cl - 1].campusName = marks[i].campusId;
        senddata[cl - 1].section[0].secName = marks.sectionId;

        senddata[cl - 1].section[0].toppers.push({
          stuTotal: marks[i].markAnalysis.overall.obtainedMarks,
          stuChem: marks[i].markAnalysis.Chemistry.obtainedMarks,
          stuMath: marks[i].markAnalysis.Maths.obtainedMarks,
          stuPhysics: marks[i].markAnalysis.Physics.obtainedMarks,
          stuName: marks[i].name
        });
        numSec[cl - 1] = 1;
      }
    }
    var finalData = [{ campus_name: "", section_name: "", student_name: "", rank: 0, physics: 0, chemistry: 0, maths: 0, total: 0 }];

    for (let i = 0; i < cl; i++) {
      for (let j = 0; j < numSec[i]; j++) {
        senddata[i].section[j].toppers.sort((a, b) => b.stuTotal - a.stuTotal);
      }
    }
    for (let i = 0; i < cl; i++) {
      finalSec[i] = { campusName: '' };
      finalSec[i].campusName = senddata[i].campusName;
      const sectionData = [];
      for (let j = 0; j < numSec[i]; j++) {
        sectionData[j] = [];
        let ptr = 0;
        if (senddata[i].section[j].secName) {
          ptr++;
          sectionData[j].push({
            sectionName: senddata[i].section[j].secName,
            topperDetails: []
          });
          for (let k = 0; k < 5; k++) {
            sectionData[j][ptr - 1].topperDetails.push(senddata[i].section[j].toppers[k]);
          }
        }
      }
      finalSec[i].sectionData = sectionData;
      finalSec[i].sectionData.splice(0, 1);
    }
    const testNames = [];
    let test = 0;
    let tflag = 0;
    for (let i = 0; i < marks.length; i++) {
      tflag = 0;
      for (let j = 0; j < test; j++) {
        if (marks[i].testName == testNames[j]) {
          tflag = 1;
          break;
        } else {
          continue;
        }
      }
      if (!tflag) {
        testNames[test] = marks[i].testName;
        test++;
      }
    }
    const csvFile = __webpack_require__("csv-file-creator");
    for (let k = 0; k < test; k++) {
      let l = 1;
      const data = [['Campus Name', 'Section Name', 'Student Name', 'Total', 'Physics', 'Chemistry', 'Maths', 'Rank']];
      data[0] = ['Campus Name', 'Section Name', 'Student Name', 'Total', 'Physics', 'Chemistry', 'Maths', 'Rank'];
      for (let i = 0; i < cl; i++) {
        for (let j = 0; j < numSec[i] - 1; j++) {
          for (let m = 0; m < 5; m++) {
            data[l++] = [finalSec[i].campusName, finalSec[i].sectionData[j][0].sectionName, finalSec[i].sectionData[j][0].topperDetails[m].stuName, finalSec[i].sectionData[j][0].topperDetails[m].stuTotal, finalSec[i].sectionData[j][0].topperDetails[m].stuPhysics, finalSec[i].sectionData[j][0].topperDetails[m].stuChem, finalSec[i].sectionData[j][0].topperDetails[m].stuMath, m + 1];
            if (k == 0) finalData.push({ campus_name: finalSec[i].campusName, section_name: finalSec[i].sectionData[j][0].sectionName,
              student_name: finalSec[i].sectionData[j][0].topperDetails[m].stuName, rank: m + 1, physics: Math.round(finalSec[i].sectionData[j][0].topperDetails[m].stuPhysics),
              chemistry: Math.round(finalSec[i].sectionData[j][0].topperDetails[m].stuChem), maths: Math.round(finalSec[i].sectionData[j][0].topperDetails[m].stuMath), total: Math.round(finalSec[i].sectionData[j][0].topperDetails[m].stuTotal) });
          }
        }
      }
      const name = `./csvFiles/${testNames[k]}_Section_Overall_Topper.csv`;
      csvFile(name, data);
    }
    finalData.splice(0, 1);
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(finalData);
    }
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({
  section,
  sectionToppers
});

/***/ }),

/***/ "./src/api/student/index.js":
/***/ (function(module, exports, __webpack_require__) {

const multer = __webpack_require__("multer");

const express = __webpack_require__("express");
const controller = __webpack_require__("./src/api/student/student.controller.js");

const router = express.Router();

const storage = multer.diskStorage({
  destination: './files',
  filename(req, file, cb) {
    cb(null, `${new Date()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/', controller.index);
router.post('/populateDb', upload.single('file'), controller.populateDb);
// router.get('/lol', controller.lol);

module.exports = router;

/***/ }),

/***/ "./src/api/student/student.controller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["index"] = index;
/* harmony export (immutable) */ __webpack_exports__["getStudent"] = getStudent;
/* harmony export (immutable) */ __webpack_exports__["populateDb"] = populateDb;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__student_model__ = __webpack_require__("./src/api/student/student.model.js");
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/students              ->  index
 * POST    /api/students              ->  create
 * GET     /api/students/:id          ->  show
 * PUT     /api/students/:id          ->  upsert
 * PATCH   /api/students/:id          ->  patch
 * DELETE  /api/students/:id          ->  destroy
 */



const fs = __webpack_require__("fs");
const csvjson = __webpack_require__("csvjson");

// Gets a list of Students
function index(req, res) {
  __WEBPACK_IMPORTED_MODULE_0__student_model__["a" /* default */].find({}, (err, docs) => {
    res.send(docs);
  });
}

function getStudent(studentData) {
  const student = {};

  student.rollNumber = studentData.rollNumber;
  student.name = studentData.name;

  student.academicDetails = {
    sectionId: studentData.sectionId,
    campusId: studentData.campusId,
    addmissionType: student.addmissionType,
    addmissionDate: student.addmissionDate
  };

  return student;
}

function populateDb(req, res) {
  const file = req.file; // file passed from client
  // const meta = req.body; // all other values passed from the client, like name, etc..

  const options = {
    delimiter: ',', // optional
    quote: '"' // optional
  };

  const studentFs = fs.readFileSync(file.path, { encoding: 'utf8' });
  const studentData = csvjson.toObject(studentFs, options);

  const students = [];
  for (let i = 0; i < studentData.length;) {
    const tmp = getStudent(studentData[i]);
    students.push(tmp);
    i += 1;
  }

  __WEBPACK_IMPORTED_MODULE_0__student_model__["a" /* default */].create(students, (err, docs) => {
    if (err) {
      console.error(err);
      res.status(200).send(err);
    } else {
      res.status(200).send(docs);
    }
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({ index, populateDb });

/***/ }),

/***/ "./src/api/student/student.model.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__("mongoose");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);

// import {registerEvents} from './student.events';

const StudentSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  addmissionNumber: { type: String, default: null },
  courseCode: { type: String, default: null },
  gender: { type: String, default: null },
  dateOfBirth: { type: Date, default: Date.now },
  addmissionDate: { type: Date, default: Date.now },
  emailAddress: { type: String, default: 'student@example.com' },
  contactNumber: { type: Number, default: null },
  academicDetails: Array,
  active: Boolean
});

// registerEvents(studentSchema);
/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('Student', StudentSchema));

/***/ }),

/***/ "./src/components/App.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired,
  // Universal HTTP client
  fetch: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func.isRequired
};

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(
 *     <App context={context}>
 *       <Layout>
 *         <LandingPage />
 *       </Layout>
 *     </App>,
 *     container,
 *   );
 */
class App extends __WEBPACK_IMPORTED_MODULE_0_react___default.a.PureComponent {

  getChildContext() {
    return this.props.context;
  }

  render() {
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.Children.only(this.props.children);
  }
}

App.propTypes = {
  context: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape(ContextType).isRequired,
  children: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.element.isRequired
};
App.childContextTypes = ContextType;
/* harmony default export */ __webpack_exports__["a"] = (App);

/***/ }),

/***/ "./src/components/Html.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_serialize_javascript__ = __webpack_require__("serialize-javascript");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_serialize_javascript___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_serialize_javascript__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config__ = __webpack_require__("./src/config.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__config__);
var _jsxFileName = '/home/aniket/iiit_study/ssad/polaris/src/components/Html.js';
/**
 * React Starter Kriasoftit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





// import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';

/* eslint-disable react/no-danger */

class Html extends __WEBPACK_IMPORTED_MODULE_0_react___default.a.Component {

  render() {
    const { title, description, styles, scripts, app, children } = this.props;
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'html',
      { className: 'no-js', lang: 'en', __source: {
          fileName: _jsxFileName,
          lineNumber: 43
        },
        __self: this
      },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'head',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 44
          },
          __self: this
        },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('meta', { charSet: 'utf-8', __source: {
            fileName: _jsxFileName,
            lineNumber: 45
          },
          __self: this
        }),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('meta', { httpEquiv: 'x-ua-compatible', content: 'ie=edge', __source: {
            fileName: _jsxFileName,
            lineNumber: 46
          },
          __self: this
        }),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'title',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 47
            },
            __self: this
          },
          title
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('meta', { name: 'description', content: description, __source: {
            fileName: _jsxFileName,
            lineNumber: 48
          },
          __self: this
        }),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1', __source: {
            fileName: _jsxFileName,
            lineNumber: 49
          },
          __self: this
        }),
        scripts.map(script => __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('link', { key: script, rel: 'preload', href: script, as: 'script', __source: {
            fileName: _jsxFileName,
            lineNumber: 51
          },
          __self: this
        })),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('link', { rel: 'apple-touch-icon', href: 'apple-touch-icon.png', __source: {
            fileName: _jsxFileName,
            lineNumber: 53
          },
          __self: this
        }),
        styles.map(style => __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('style', {
          key: style.id,
          id: style.id,
          dangerouslySetInnerHTML: { __html: style.cssText },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 55
          },
          __self: this
        }))
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'body',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 62
          },
          __self: this
        },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { id: 'app', dangerouslySetInnerHTML: { __html: children }, __source: {
            fileName: _jsxFileName,
            lineNumber: 63
          },
          __self: this
        }),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('script', {
          dangerouslySetInnerHTML: { __html: `window.App=${__WEBPACK_IMPORTED_MODULE_2_serialize_javascript___default()(app)}` },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 64
          },
          __self: this
        }),
        scripts.map(script => __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('script', { key: script, src: script, __source: {
            fileName: _jsxFileName,
            lineNumber: 67
          },
          __self: this
        })),
        __WEBPACK_IMPORTED_MODULE_3__config___default.a.analytics.googleTrackingId && __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('script', {
          dangerouslySetInnerHTML: {
            __html: 'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' + `ga('create','${__WEBPACK_IMPORTED_MODULE_3__config___default.a.analytics.googleTrackingId}','auto');ga('send','pageview')`
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 69
          },
          __self: this
        }),
        __WEBPACK_IMPORTED_MODULE_3__config___default.a.analytics.googleTrackingId && __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('script', {
          src: 'https://www.google-analytics.com/analytics.js',
          async: true,
          defer: true,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 80
          },
          __self: this
        })
      )
    );
  }
}

Html.propTypes = {
  title: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
  description: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
  styles: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    id: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
    cssText: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired
  }).isRequired),
  scripts: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired),
  app: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object, // eslint-disable-line
  children: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired
};
Html.defaultProps = {
  styles: [],
  scripts: []
};
/* harmony default export */ __webpack_exports__["a"] = (Html);

/***/ }),

/***/ "./src/config.js":
/***/ (function(module, exports, __webpack_require__) {

/*
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

if (false) {
  throw new Error('Do not import `config.js` from inside the client-side code.');
}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl: process.env.API_SERVER_URL || `http://localhost:${process.env.PORT || 3000}`
  },

  // Database
  databaseUrl: process.env.DATABASE_URL || 'sqlite:database.sqlite',

  //  MongoDb
  mongo: {
    uri: process.env.MONGODB_URL || 'mongodb://localhost/polaris-dev'
  },

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID // UA-XXXXX-X
  },

  // Authentication
  auth: {
    jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },

    // https://developers.facebook.com/
    facebook: {
      id: process.env.FACEBOOK_APP_ID || '186244551745631',
      secret: process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc'
    },

    // https://cloud.google.com/console/project
    google: {
      id: process.env.GOOGLE_CLIENT_ID || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
      secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd'
    },

    // https://apps.twitter.com/
    twitter: {
      key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
      secret: process.env.TWITTER_CONSUMER_SECRET || 'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ'
    }
  }
};

/***/ }),

/***/ "./src/createFetch.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

function createFetch(fetch, { baseUrl, cookie }) {
  // NOTE: Tweak the default options to suite your application needs
  const defaults = {
    method: 'POST', // handy with GraphQL backends
    mode: baseUrl ? 'cors' : 'same-origin',
    credentials: baseUrl ? 'include' : 'same-origin',
    headers: _extends({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }, cookie ? { Cookie: cookie } : null)
  };

  return (url, options) => url.startsWith('/graphql') || url.startsWith('/api') ? fetch(`${baseUrl}${url}`, _extends({}, defaults, options, {
    headers: _extends({}, defaults.headers, options && options.headers)
  })) : fetch(url, options);
}

/* harmony default export */ __webpack_exports__["a"] = (createFetch);

/***/ }),

/***/ "./src/data/models/User.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__("sequelize");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const User = __WEBPACK_IMPORTED_MODULE_1__sequelize__["a" /* default */].define('User', {
  id: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUID,
    defaultValue: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUIDV1,
    primaryKey: true
  },

  email: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255),
    validate: { isEmail: true }
  },

  emailConfirmed: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.BOOLEAN,
    defaultValue: false
  }
}, {
  indexes: [{ fields: ['email'] }]
});

/* harmony default export */ __webpack_exports__["a"] = (User);

/***/ }),

/***/ "./src/data/models/UserClaim.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__("sequelize");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const UserClaim = __WEBPACK_IMPORTED_MODULE_1__sequelize__["a" /* default */].define('UserClaim', {
  type: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING
  },

  value: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING
  }
});

/* harmony default export */ __webpack_exports__["a"] = (UserClaim);

/***/ }),

/***/ "./src/data/models/UserLogin.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__("sequelize");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const UserLogin = __WEBPACK_IMPORTED_MODULE_1__sequelize__["a" /* default */].define('UserLogin', {
  name: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(50),
    primaryKey: true
  },

  key: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(100),
    primaryKey: true
  }
});

/* harmony default export */ __webpack_exports__["a"] = (UserLogin);

/***/ }),

/***/ "./src/data/models/UserProfile.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__("sequelize");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const UserProfile = __WEBPACK_IMPORTED_MODULE_1__sequelize__["a" /* default */].define('UserProfile', {
  userId: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.UUID,
    primaryKey: true
  },

  displayName: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(100)
  },

  picture: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255)
  },

  gender: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(50)
  },

  location: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(100)
  },

  website: {
    type: __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a.STRING(255)
  }
});

/* harmony default export */ __webpack_exports__["a"] = (UserProfile);

/***/ }),

/***/ "./src/data/models/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sequelize__ = __webpack_require__("./src/data/sequelize.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__User__ = __webpack_require__("./src/data/models/User.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__UserLogin__ = __webpack_require__("./src/data/models/UserLogin.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__UserClaim__ = __webpack_require__("./src/data/models/UserClaim.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__UserProfile__ = __webpack_require__("./src/data/models/UserProfile.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__User__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__UserLogin__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_3__UserClaim__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_4__UserProfile__["a"]; });
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */







__WEBPACK_IMPORTED_MODULE_1__User__["a" /* default */].hasMany(__WEBPACK_IMPORTED_MODULE_2__UserLogin__["a" /* default */], {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

__WEBPACK_IMPORTED_MODULE_1__User__["a" /* default */].hasMany(__WEBPACK_IMPORTED_MODULE_3__UserClaim__["a" /* default */], {
  foreignKey: 'userId',
  as: 'claims',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

__WEBPACK_IMPORTED_MODULE_1__User__["a" /* default */].hasOne(__WEBPACK_IMPORTED_MODULE_4__UserProfile__["a" /* default */], {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade'
});

function sync(...args) {
  return __WEBPACK_IMPORTED_MODULE_0__sequelize__["a" /* default */].sync(...args);
}

/* harmony default export */ __webpack_exports__["e"] = ({ sync });


/***/ }),

/***/ "./src/data/queries/CWUAnalysisReport.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__("graphql");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_CWUAnalysisReportType__ = __webpack_require__("./src/data/types/CWUAnalysisReportType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_cwuAnalysisReport_cwuAnalysisReport_model__ = __webpack_require__("./src/api/cwuAnalysisReport/cwuAnalysisReport.model.js");
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }






const cwuAnalysisReport = {
  args: {
    testId: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
    academicYear: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] }
  },
  type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLList"](__WEBPACK_IMPORTED_MODULE_1__types_CWUAnalysisReportType__["a" /* default */]),
  resolve(obj, args) {
    return _asyncToGenerator(function* () {
      const masterResults = yield __WEBPACK_IMPORTED_MODULE_2__api_cwuAnalysisReport_cwuAnalysisReport_model__["a" /* default */].find({
        testId: args.testId,
        academicYear: args.academicYear
      }).exec();

      return masterResults;
    })();
  }
};

/* harmony default export */ __webpack_exports__["a"] = (cwuAnalysisReport);

/***/ }),

/***/ "./src/data/queries/allIndiaMarksAnalysisReport.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__("graphql");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__types_AllIndiaMarksAnalysisType__ = __webpack_require__("./src/data/types/AllIndiaMarksAnalysisType.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_allIndiaMarksAnalysisReport_allIndiaMarksAnalysisReport_model__ = __webpack_require__("./src/api/allIndiaMarksAnalysisReport/allIndiaMarksAnalysisReport.model.js");
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }






const allIndiaMarksAnalysisReport = {
  args: {
    testId: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
    academicYear: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] }
  },
  type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLList"](__WEBPACK_IMPORTED_MODULE_1__types_AllIndiaMarksAnalysisType__["a" /* default */]),
  resolve(obj, args) {
    return _asyncToGenerator(function* () {
      const masterResults = yield __WEBPACK_IMPORTED_MODULE_2__api_allIndiaMarksAnalysisReport_allIndiaMarksAnalysisReport_model__["a" /* default */].find({
        testId: args.testId,
        academicYear: args.academicYear
      }).exec();

      return masterResults;
    })();
  }
};

/* harmony default export */ __webpack_exports__["a"] = (allIndiaMarksAnalysisReport);

/***/ }),

/***/ "./src/data/queries/me.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__types_UserType__ = __webpack_require__("./src/data/types/UserType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



const me = {
  type: __WEBPACK_IMPORTED_MODULE_0__types_UserType__["a" /* default */],
  resolve({ request }) {
    return request.user && {
      id: request.user.id,
      email: request.user.email
    };
  }
};

/* harmony default export */ __webpack_exports__["a"] = (me);

/***/ }),

/***/ "./src/data/queries/news.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__("graphql");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__ = __webpack_require__("isomorphic-fetch");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__types_NewsItemType__ = __webpack_require__("./src/data/types/NewsItemType.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */





// React.js News Feed (RSS)
const url = 'https://api.rss2json.com/v1/api.json' + '?rss_url=https%3A%2F%2Freactjsnews.com%2Ffeed.xml';

let items = [];
let lastFetchTask;
let lastFetchTime = new Date(1970, 0, 1);

const news = {
  type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLList"](__WEBPACK_IMPORTED_MODULE_2__types_NewsItemType__["a" /* default */]),
  resolve() {
    if (lastFetchTask) {
      return lastFetchTask;
    }

    if (new Date() - lastFetchTime > 1000 * 60 * 10 /* 10 mins */) {
        lastFetchTime = new Date();
        lastFetchTask = __WEBPACK_IMPORTED_MODULE_1_isomorphic_fetch___default()(url).then(response => response.json()).then(data => {
          if (data.status === 'ok') {
            items = data.items;
          }

          lastFetchTask = null;
          return items;
        }).catch(err => {
          lastFetchTask = null;
          throw err;
        });

        if (items.length) {
          return items;
        }

        return lastFetchTask;
      }

    return items;
  }
};

/* harmony default export */ __webpack_exports__["a"] = (news);

/***/ }),

/***/ "./src/data/schema.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__("graphql");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__queries_me__ = __webpack_require__("./src/data/queries/me.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__queries_news__ = __webpack_require__("./src/data/queries/news.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__queries_allIndiaMarksAnalysisReport__ = __webpack_require__("./src/data/queries/allIndiaMarksAnalysisReport.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__queries_CWUAnalysisReport__ = __webpack_require__("./src/data/queries/CWUAnalysisReport.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */








const schema = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLSchema"]({
  query: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
    name: 'Query',
    fields: {
      me: __WEBPACK_IMPORTED_MODULE_1__queries_me__["a" /* default */],
      news: __WEBPACK_IMPORTED_MODULE_2__queries_news__["a" /* default */],
      allIndiaMarksAnalysisReport: __WEBPACK_IMPORTED_MODULE_3__queries_allIndiaMarksAnalysisReport__["a" /* default */],
      cwuAnalysisReport: __WEBPACK_IMPORTED_MODULE_4__queries_CWUAnalysisReport__["a" /* default */]
    }
  })
});

/* harmony default export */ __webpack_exports__["a"] = (schema);

/***/ }),

/***/ "./src/data/sequelize.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize__ = __webpack_require__("sequelize");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_sequelize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_sequelize__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__("./src/config.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__config__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




const sequelize = new __WEBPACK_IMPORTED_MODULE_0_sequelize___default.a(__WEBPACK_IMPORTED_MODULE_1__config___default.a.databaseUrl, {
  define: {
    freezeTableName: true
  }
});

/* harmony default export */ __webpack_exports__["a"] = (sequelize);

/***/ }),

/***/ "./src/data/types/AllIndiaMarksAnalysisType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__("graphql");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);


const ReportType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'Report',
  fields: {
    rollNumber: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
    name: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
    campusId: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },

    phyMarks120: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    cheMarks120: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    matMarks120: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },

    phyRank: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    cheRank: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    matRank: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },

    overallMarks: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    overallRank: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] }
  }
});

const AllIndiaMarksAnalysisType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'AllIndiaMarksAnalysis',
  fields: {
    testId: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
    reports: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLList"](ReportType) }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (AllIndiaMarksAnalysisType);

/***/ }),

/***/ "./src/data/types/CWUAnalysisReportType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__("graphql");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);


const CWUReportType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'CWUReport',
  fields: {
    rollNumber: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
    name: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
    campusId: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },

    Physics_C: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    Physics_W: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    Physics_U: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },

    Chemistry_C: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    Chemistry_W: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    Chemistry_U: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },

    Maths_C: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    Maths_W: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] },
    Maths_U: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLInt"] }
  }
});

const CWUAnalysisReportType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'CWUAnalysisReport',
  fields: {
    testId: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
    reports: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLList"](CWUReportType) }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (CWUAnalysisReportType);

/***/ }),

/***/ "./src/data/types/NewsItemType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__("graphql");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



const NewsItemType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'NewsItem',
  fields: {
    title: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"]) },
    link: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"]) },
    author: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] },
    pubDate: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"]) },
    content: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (NewsItemType);

/***/ }),

/***/ "./src/data/types/UserType.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql__ = __webpack_require__("graphql");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_graphql__);
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */



const UserType = new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLObjectType"]({
  name: 'User',
  fields: {
    id: { type: new __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLNonNull"](__WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLID"]) },
    email: { type: __WEBPACK_IMPORTED_MODULE_0_graphql__["GraphQLString"] }
  }
});

/* harmony default export */ __webpack_exports__["a"] = (UserType);

/***/ }),

/***/ "./src/passport.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_passport__ = __webpack_require__("passport");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_passport___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_passport__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport_facebook__ = __webpack_require__("passport-facebook");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_passport_facebook___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_passport_facebook__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_models__ = __webpack_require__("./src/data/models/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config__ = __webpack_require__("./src/config.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__config__);
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Passport.js reference implementation.
 * The database schema used in this sample is available at
 * https://github.com/membership/membership.db/tree/master/postgres
 */






/**
 * Sign in with Facebook.
 */
__WEBPACK_IMPORTED_MODULE_0_passport___default.a.use(new __WEBPACK_IMPORTED_MODULE_1_passport_facebook__["Strategy"]({
  clientID: __WEBPACK_IMPORTED_MODULE_3__config___default.a.auth.facebook.id,
  clientSecret: __WEBPACK_IMPORTED_MODULE_3__config___default.a.auth.facebook.secret,
  callbackURL: '/login/facebook/return',
  profileFields: ['displayName', 'name', 'email', 'link', 'locale', 'timezone'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  /* eslint-disable no-underscore-dangle */
  const loginName = 'facebook';
  const claimType = 'urn:facebook:access_token';
  const fooBar = (() => {
    var _ref = _asyncToGenerator(function* () {
      if (req.user) {
        const userLogin = yield __WEBPACK_IMPORTED_MODULE_2__data_models__["c" /* UserLogin */].findOne({
          attributes: ['name', 'key'],
          where: { name: loginName, key: profile.id }
        });
        if (userLogin) {
          // There is already a Facebook account that belongs to you.
          // Sign in with that account or delete it, then link it with your current account.
          done();
        } else {
          const user = yield __WEBPACK_IMPORTED_MODULE_2__data_models__["a" /* User */].create({
            id: req.user.id,
            email: profile._json.email,
            logins: [{ name: loginName, key: profile.id }],
            claims: [{ type: claimType, value: profile.id }],
            profile: {
              displayName: profile.displayName,
              gender: profile._json.gender,
              picture: `https://graph.facebook.com/${profile.id}/picture?type=large`
            }
          }, {
            include: [{ model: __WEBPACK_IMPORTED_MODULE_2__data_models__["c" /* UserLogin */], as: 'logins' }, { model: __WEBPACK_IMPORTED_MODULE_2__data_models__["b" /* UserClaim */], as: 'claims' }, { model: __WEBPACK_IMPORTED_MODULE_2__data_models__["d" /* UserProfile */], as: 'profile' }]
          });
          done(null, {
            id: user.id,
            email: user.email
          });
        }
      } else {
        const users = yield __WEBPACK_IMPORTED_MODULE_2__data_models__["a" /* User */].findAll({
          attributes: ['id', 'email'],
          where: { '$logins.name$': loginName, '$logins.key$': profile.id },
          include: [{
            attributes: ['name', 'key'],
            model: __WEBPACK_IMPORTED_MODULE_2__data_models__["c" /* UserLogin */],
            as: 'logins',
            required: true
          }]
        });
        if (users.length) {
          const user = users[0].get({ plain: true });
          done(null, user);
        } else {
          let user = yield __WEBPACK_IMPORTED_MODULE_2__data_models__["a" /* User */].findOne({
            where: { email: profile._json.email }
          });
          if (user) {
            // There is already an account using this email address. Sign in to
            // that account and link it with Facebook manually from Account Settings.
            done(null);
          } else {
            user = yield __WEBPACK_IMPORTED_MODULE_2__data_models__["a" /* User */].create({
              email: profile._json.email,
              emailConfirmed: true,
              logins: [{ name: loginName, key: profile.id }],
              claims: [{ type: claimType, value: accessToken }],
              profile: {
                displayName: profile.displayName,
                gender: profile._json.gender,
                picture: `https://graph.facebook.com/${profile.id}/picture?type=large`
              }
            }, {
              include: [{ model: __WEBPACK_IMPORTED_MODULE_2__data_models__["c" /* UserLogin */], as: 'logins' }, { model: __WEBPACK_IMPORTED_MODULE_2__data_models__["b" /* UserClaim */], as: 'claims' }, { model: __WEBPACK_IMPORTED_MODULE_2__data_models__["d" /* UserProfile */], as: 'profile' }]
            });
            done(null, {
              id: user.id,
              email: user.email
            });
          }
        }
      }
    });

    return function fooBar() {
      return _ref.apply(this, arguments);
    };
  })();

  fooBar().catch(done);
}));

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_passport___default.a);

/***/ }),

/***/ "./src/router.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_universal_router__ = __webpack_require__("universal-router");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_universal_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_universal_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routes__ = __webpack_require__("./src/routes/index.js");
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




/* harmony default export */ __webpack_exports__["default"] = (new __WEBPACK_IMPORTED_MODULE_0_universal_router___default.a(__WEBPACK_IMPORTED_MODULE_1__routes__["a" /* default */], {
  resolveRoute(context, params) {
    if (typeof context.route.load === 'function') {
      return context.route.load().then(action => action.default(context, params));
    }
    if (typeof context.route.action === 'function') {
      return context.route.action(context, params);
    }
    return null;
  }
}));

/***/ }),

/***/ "./src/routes/error/ErrorPage.css":
/***/ (function(module, exports, __webpack_require__) {


    var content = __webpack_require__("./node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./node_modules/postcss-loader/lib/index.js?{\"config\":{\"path\":\"./tools/postcss.config.js\"}}!./src/routes/error/ErrorPage.css");
    var insertCss = __webpack_require__("./node_modules/isomorphic-style-loader/lib/insertCss.js");

    if (typeof content === 'string') {
      content = [[module.i, content, '']];
    }

    module.exports = content.locals || {};
    module.exports._getContent = function() { return content; };
    module.exports._getCss = function() { return content.toString(); };
    module.exports._insertCss = function(options) { return insertCss(content, options) };
    
    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (module.hot && typeof window !== 'undefined' && window.document) {
      var removeCss = function() {};
      module.hot.accept("./node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./node_modules/postcss-loader/lib/index.js?{\"config\":{\"path\":\"./tools/postcss.config.js\"}}!./src/routes/error/ErrorPage.css", function() {
        content = __webpack_require__("./node_modules/css-loader/index.js?{\"importLoaders\":1,\"sourceMap\":true,\"modules\":true,\"localIdentName\":\"[name]-[local]-[hash:base64:5]\",\"minimize\":false,\"discardComments\":{\"removeAll\":true}}!./node_modules/postcss-loader/lib/index.js?{\"config\":{\"path\":\"./tools/postcss.config.js\"}}!./src/routes/error/ErrorPage.css");

        if (typeof content === 'string') {
          content = [[module.i, content, '']];
        }

        removeCss = insertCss(content, { replace: true });
      });
      module.hot.dispose(function() { removeCss(); });
    }
  

/***/ }),

/***/ "./src/routes/error/ErrorPage.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ErrorPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_isomorphic_style_loader_lib_withStyles__ = __webpack_require__("isomorphic-style-loader/lib/withStyles");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_isomorphic_style_loader_lib_withStyles___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_isomorphic_style_loader_lib_withStyles__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ErrorPage_css__ = __webpack_require__("./src/routes/error/ErrorPage.css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ErrorPage_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__ErrorPage_css__);
var _jsxFileName = '/home/aniket/iiit_study/ssad/polaris/src/routes/error/ErrorPage.js';
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */






class ErrorPage extends __WEBPACK_IMPORTED_MODULE_0_react___default.a.Component {

  render() {
    if (true && this.props.error) {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 31
          },
          __self: this
        },
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'h1',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 32
            },
            __self: this
          },
          this.props.error.name
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'pre',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 33
            },
            __self: this
          },
          this.props.error.stack
        )
      );
    }

    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'div',
      {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 39
        },
        __self: this
      },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'h1',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 40
          },
          __self: this
        },
        'Error'
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'p',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 41
          },
          __self: this
        },
        'Sorry, a critical error occurred on this page.'
      )
    );
  }
}

ErrorPage.propTypes = {
  error: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    name: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
    message: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired,
    stack: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string.isRequired
  })
};
ErrorPage.defaultProps = {
  error: null
};

/* harmony default export */ __webpack_exports__["b"] = (__WEBPACK_IMPORTED_MODULE_2_isomorphic_style_loader_lib_withStyles___default()(__WEBPACK_IMPORTED_MODULE_3__ErrorPage_css___default.a)(ErrorPage));

/***/ }),

/***/ "./src/routes/error/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ErrorPage__ = __webpack_require__("./src/routes/error/ErrorPage.js");
var _jsxFileName = '/home/aniket/iiit_study/ssad/polaris/src/routes/error/index.js';
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */




function action() {
  return {
    title: 'Demo Error',
    component: __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__ErrorPage__["b" /* default */], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 16
      },
      __self: this
    })
  };
}

/* harmony default export */ __webpack_exports__["default"] = (action);

/***/ }),

/***/ "./src/routes/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [{
    path: '/',
    load: () => __webpack_require__.e/* import() */(9).then(__webpack_require__.bind(null, "./src/routes/home/index.js"))
  }, {
    path: '/reports',
    children: [{
      path: '',
      load: () => __webpack_require__.e/* import() */(8).then(__webpack_require__.bind(null, "./src/routes/reports/index.js"))
    }, {
      path: '/view',
      load: () => __webpack_require__.e/* import() */(12).then(__webpack_require__.bind(null, "./src/routes/reports/view/index.js"))
    }, {
      path: '/overAllAverages',
      children: [{
        path: '/total',
        load: () => __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, "./src/routes/reports/overAllAverages/total/index.js"))
      }, {
        path: '/campus',
        load: () => __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, "./src/routes/reports/overAllAverages/campus/index.js"))
      }]
    }, {
      path: '/sectionAverages',
      children: [{
        path: '/section',
        load: () => __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, "./src/routes/reports/sectionAverages/section/index.js"))
      }, {
        path: '/sectionToppers',
        load: () => __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, "./src/routes/reports/sectionAverages/sectionToppers/index.js"))
      }]
    }, {
      path: '/campusToppers',
      children: [{
        path: '/campusTopper',
        load: () => __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, "./src/routes/reports/campusToppers/campusTopper/index.js"))
      }, {
        path: '/topper',
        load: () => __webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, "./src/routes/reports/campusToppers/topper/index.js"))
      }]
    }]
  }, {
    path: '/teachers',
    load: () => __webpack_require__.e/* import() */(5).then(__webpack_require__.bind(null, "./src/routes/teachers/index.js"))
  }, {
    path: '/campus',
    load: () => __webpack_require__.e/* import() */(10).then(__webpack_require__.bind(null, "./src/routes/campus/index.js"))
  }, {
    path: '/graphs',
    load: () => __webpack_require__.e/* import() */(11).then(__webpack_require__.bind(null, "./src/routes/graphs/index.js"))
  }, {
    path: '/students',
    load: () => __webpack_require__.e/* import() */(6).then(__webpack_require__.bind(null, "./src/routes/students/index.js"))
  }, {
    path: '/tests',
    children: [{
      path: '',
      load: () => __webpack_require__.e/* import() */(2).then(__webpack_require__.bind(null, "./src/routes/tests/index.js"))
    }, {
      path: '/newTest',
      load: () => __webpack_require__.e/* import() */(1).then(__webpack_require__.bind(null, "./src/routes/tests/newTest/index.js"))
    }, {
      path: '/uploaded',
      load: () => __webpack_require__.e/* import() */(3).then(__webpack_require__.bind(null, "./src/routes/tests/uploaded/index.js"))
    }, {
      path: '/uploadError',
      load: () => __webpack_require__.e/* import() */(4).then(__webpack_require__.bind(null, "./src/routes/tests/uploadError/index.js"))
    }]
  }, {
    path: '/settings',
    load: () => __webpack_require__.e/* import() */(7).then(__webpack_require__.bind(null, "./src/routes/settings/index.js"))
  },

  // Wildcard routes, e.g. { path: '*', ... } (must go last)
  {
    path: '*',
    load: () => __webpack_require__.e/* import() */(13).then(__webpack_require__.bind(null, "./src/routes/not-found/index.js"))
  }],

  action({ next }) {
    return _asyncToGenerator(function* () {
      // Execute each child route until one of them return the result
      const route = yield next();

      // Provide default values for title, description etc.
      route.title = `${route.title || 'Untitled Page'}`;
      route.description = route.description || '';

      return route;
    })();
  }
};

// The error page is available by permanent url for development mode
if (true) {
  routes.children.unshift({
    path: '/error',
    action: __webpack_require__("./src/routes/error/index.js").default
  });
}

/* harmony default export */ __webpack_exports__["a"] = (routes);

/***/ }),

/***/ "./src/server.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path__ = __webpack_require__("path");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express__ = __webpack_require__("express");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_mongoose__ = __webpack_require__("mongoose");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_mongoose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_cookie_parser__ = __webpack_require__("cookie-parser");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_cookie_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_cookie_parser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_body_parser__ = __webpack_require__("body-parser");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_body_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_body_parser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_express_jwt__ = __webpack_require__("express-jwt");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_express_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_express_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_express_graphql__ = __webpack_require__("express-graphql");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_express_graphql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_express_graphql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_jsonwebtoken__ = __webpack_require__("jsonwebtoken");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_jsonwebtoken___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_jsonwebtoken__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_node_fetch__ = __webpack_require__("node-fetch");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_node_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_node_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_react_dom_server__ = __webpack_require__("react-dom/server");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_react_dom_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_react_dom_server__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_pretty_error__ = __webpack_require__("pretty-error");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_pretty_error___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_pretty_error__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_App__ = __webpack_require__("./src/components/App.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_Html__ = __webpack_require__("./src/components/Html.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__routes_error_ErrorPage__ = __webpack_require__("./src/routes/error/ErrorPage.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__routes_error_ErrorPage_css__ = __webpack_require__("./src/routes/error/ErrorPage.css");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__routes_error_ErrorPage_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__routes_error_ErrorPage_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__createFetch__ = __webpack_require__("./src/createFetch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__passport__ = __webpack_require__("./src/passport.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__router__ = __webpack_require__("./src/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__data_models__ = __webpack_require__("./src/data/models/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__data_schema__ = __webpack_require__("./src/data/schema.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__assets_json__ = __webpack_require__("./assets.json");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__assets_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21__assets_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__config__ = __webpack_require__("./src/config.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22__config__);
var _jsxFileName = '/home/aniket/iiit_study/ssad/polaris/src/server.js',
    _this = this;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */






















 // eslint-disable-line import/no-unresolved


__WEBPACK_IMPORTED_MODULE_2_mongoose___default.a.Promise = __webpack_require__("bluebird");

// Connect to MongoDB
__WEBPACK_IMPORTED_MODULE_2_mongoose___default.a.connect(__WEBPACK_IMPORTED_MODULE_22__config___default.a.mongo.uri, __WEBPACK_IMPORTED_MODULE_22__config___default.a.mongo.options);
__WEBPACK_IMPORTED_MODULE_2_mongoose___default.a.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

const app = __WEBPACK_IMPORTED_MODULE_1_express___default()();

__webpack_require__("./src/api/index.js").default(app);

// app.post('/files', upload.single('file'), (req, res) => {
//   const file = req.file; // file passed from client
//   const meta = req.body; // all other values passed from the client, like name, etc..
//   console.log(file);
//   res.send(200);
// });
//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(__WEBPACK_IMPORTED_MODULE_1_express___default.a.static(__WEBPACK_IMPORTED_MODULE_0_path___default.a.resolve(__dirname, 'public')));
app.use(__WEBPACK_IMPORTED_MODULE_3_cookie_parser___default()());
app.use(__WEBPACK_IMPORTED_MODULE_4_body_parser___default.a.urlencoded({ extended: true }));
app.use(__WEBPACK_IMPORTED_MODULE_4_body_parser___default.a.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(__WEBPACK_IMPORTED_MODULE_5_express_jwt___default()({
  secret: __WEBPACK_IMPORTED_MODULE_22__config___default.a.auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token
}));
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof __WEBPACK_IMPORTED_MODULE_5_express_jwt__["UnauthorizedError"]) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});

app.use(__WEBPACK_IMPORTED_MODULE_17__passport__["a" /* default */].initialize());

if (true) {
  app.enable('trust proxy');
}
app.get('/login/facebook', __WEBPACK_IMPORTED_MODULE_17__passport__["a" /* default */].authenticate('facebook', {
  scope: ['email', 'user_location'],
  session: false
}));
app.get('/login/facebook/return', __WEBPACK_IMPORTED_MODULE_17__passport__["a" /* default */].authenticate('facebook', {
  failureRedirect: '/login',
  session: false
}), (req, res) => {
  const expiresIn = 60 * 60 * 24 * 180; // 180 days
  const token = __WEBPACK_IMPORTED_MODULE_7_jsonwebtoken___default.a.sign(req.user, __WEBPACK_IMPORTED_MODULE_22__config___default.a.auth.jwt.secret, { expiresIn });
  res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
  res.redirect('/');
});

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', __WEBPACK_IMPORTED_MODULE_6_express_graphql___default()(req => ({
  schema: __WEBPACK_IMPORTED_MODULE_20__data_schema__["a" /* default */],
  graphiql: true,
  rootValue: { request: req },
  pretty: true
})));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', (() => {
  var _ref = _asyncToGenerator(function* (req, res, next) {
    try {
      const css = new Set();

      // Global (context) variables that can be easily accessed from any React component
      // https://facebook.github.io/react/docs/context.html
      const context = {
        // Enables critical path CSS rendering
        // https://github.com/kriasoft/isomorphic-style-loader
        insertCss: function (...styles) {
          // eslint-disable-next-line no-underscore-dangle
          styles.forEach(function (style) {
            return css.add(style._getCss());
          });
        },
        // Universal HTTP client
        fetch: Object(__WEBPACK_IMPORTED_MODULE_16__createFetch__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_8_node_fetch___default.a, {
          baseUrl: __WEBPACK_IMPORTED_MODULE_22__config___default.a.api.serverUrl,
          cookie: req.headers.cookie
        })
      };

      const route = yield __WEBPACK_IMPORTED_MODULE_18__router__["default"].resolve(_extends({}, context, {
        path: req.path,
        query: req.query
      }));

      if (route.redirect) {
        res.redirect(route.status || 302, route.redirect);
        return;
      }

      const data = _extends({}, route);
      data.children = __WEBPACK_IMPORTED_MODULE_10_react_dom_server___default.a.renderToString(__WEBPACK_IMPORTED_MODULE_9_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_12__components_App__["a" /* default */],
        { context: context, __source: {
            fileName: _jsxFileName,
            lineNumber: 164
          },
          __self: _this
        },
        route.component
      ));
      data.styles = [{ id: 'css', cssText: [...css].join('') }];
      data.scripts = [__WEBPACK_IMPORTED_MODULE_21__assets_json___default.a.vendor.js];
      if (route.chunks) {
        data.scripts.push(...route.chunks.map(function (chunk) {
          return __WEBPACK_IMPORTED_MODULE_21__assets_json___default.a[chunk].js;
        }));
      }
      data.scripts.push(__WEBPACK_IMPORTED_MODULE_21__assets_json___default.a.client.js);
      data.app = {
        apiUrl: __WEBPACK_IMPORTED_MODULE_22__config___default.a.api.clientUrl
      };

      const html = __WEBPACK_IMPORTED_MODULE_10_react_dom_server___default.a.renderToStaticMarkup(__WEBPACK_IMPORTED_MODULE_9_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_13__components_Html__["a" /* default */], _extends({}, data, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 178
        },
        __self: _this
      })));
      res.status(route.status || 200);
      res.send(`<!doctype html>${html}`);
    } catch (err) {
      next(err);
    }
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})());

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new __WEBPACK_IMPORTED_MODULE_11_pretty_error___default.a();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = __WEBPACK_IMPORTED_MODULE_10_react_dom_server___default.a.renderToStaticMarkup(__WEBPACK_IMPORTED_MODULE_9_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_13__components_Html__["a" /* default */],
    {
      title: 'Internal Server Error',
      description: err.message,
      styles: [{ id: 'css', cssText: __WEBPACK_IMPORTED_MODULE_15__routes_error_ErrorPage_css___default.a._getCss() }] // eslint-disable-line no-underscore-dangle
      , __source: {
        fileName: _jsxFileName,
        lineNumber: 197
      },
      __self: _this
    },
    __WEBPACK_IMPORTED_MODULE_10_react_dom_server___default.a.renderToString(__WEBPACK_IMPORTED_MODULE_9_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_14__routes_error_ErrorPage__["a" /* ErrorPageWithoutStyle */], { error: err, __source: {
        fileName: _jsxFileName,
        lineNumber: 202
      },
      __self: _this
    }))
  ));
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = __WEBPACK_IMPORTED_MODULE_19__data_models__["e" /* default */].sync().catch(err => console.error(err.stack));
if (false) {
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (true) {
  app.hot = module.hot;
  module.hot.accept("./src/router.js", function() { /* harmony import */ __WEBPACK_IMPORTED_MODULE_18__router__ = __webpack_require__("./src/router.js");  });
}

/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("babel-polyfill");
module.exports = __webpack_require__("./src/server.js");


/***/ }),

/***/ "axios":
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "babel-polyfill":
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),

/***/ "babel-runtime/core-js/json/stringify":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),

/***/ "babel-runtime/helpers/slicedToArray":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ }),

/***/ "bluebird":
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),

/***/ "body-parser":
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "classnames":
/***/ (function(module, exports) {

module.exports = require("classnames");

/***/ }),

/***/ "cookie-parser":
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),

/***/ "csv-file-creator":
/***/ (function(module, exports) {

module.exports = require("csv-file-creator");

/***/ }),

/***/ "csvjson":
/***/ (function(module, exports) {

module.exports = require("csvjson");

/***/ }),

/***/ "express":
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-graphql":
/***/ (function(module, exports) {

module.exports = require("express-graphql");

/***/ }),

/***/ "express-jwt":
/***/ (function(module, exports) {

module.exports = require("express-jwt");

/***/ }),

/***/ "fs":
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "graphql":
/***/ (function(module, exports) {

module.exports = require("graphql");

/***/ }),

/***/ "history/createBrowserHistory":
/***/ (function(module, exports) {

module.exports = require("history/createBrowserHistory");

/***/ }),

/***/ "isomorphic-fetch":
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),

/***/ "isomorphic-style-loader/lib/withStyles":
/***/ (function(module, exports) {

module.exports = require("isomorphic-style-loader/lib/withStyles");

/***/ }),

/***/ "jsonwebtoken":
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "jspdf":
/***/ (function(module, exports) {

module.exports = require("jspdf");

/***/ }),

/***/ "material-ui/DatePicker":
/***/ (function(module, exports) {

module.exports = require("material-ui/DatePicker");

/***/ }),

/***/ "material-ui/Dialog":
/***/ (function(module, exports) {

module.exports = require("material-ui/Dialog");

/***/ }),

/***/ "material-ui/Drawer":
/***/ (function(module, exports) {

module.exports = require("material-ui/Drawer");

/***/ }),

/***/ "material-ui/FlatButton":
/***/ (function(module, exports) {

module.exports = require("material-ui/FlatButton");

/***/ }),

/***/ "material-ui/List":
/***/ (function(module, exports) {

module.exports = require("material-ui/List");

/***/ }),

/***/ "material-ui/MenuItem":
/***/ (function(module, exports) {

module.exports = require("material-ui/MenuItem");

/***/ }),

/***/ "material-ui/RefreshIndicator":
/***/ (function(module, exports) {

module.exports = require("material-ui/RefreshIndicator");

/***/ }),

/***/ "material-ui/SelectField":
/***/ (function(module, exports) {

module.exports = require("material-ui/SelectField");

/***/ }),

/***/ "material-ui/Table":
/***/ (function(module, exports) {

module.exports = require("material-ui/Table");

/***/ }),

/***/ "material-ui/TextField":
/***/ (function(module, exports) {

module.exports = require("material-ui/TextField");

/***/ }),

/***/ "material-ui/styles/MuiThemeProvider":
/***/ (function(module, exports) {

module.exports = require("material-ui/styles/MuiThemeProvider");

/***/ }),

/***/ "material-ui/styles/baseThemes/lightBaseTheme":
/***/ (function(module, exports) {

module.exports = require("material-ui/styles/baseThemes/lightBaseTheme");

/***/ }),

/***/ "material-ui/styles/getMuiTheme":
/***/ (function(module, exports) {

module.exports = require("material-ui/styles/getMuiTheme");

/***/ }),

/***/ "mongoose":
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "multer":
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),

/***/ "node-fetch":
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),

/***/ "passport":
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),

/***/ "passport-facebook":
/***/ (function(module, exports) {

module.exports = require("passport-facebook");

/***/ }),

/***/ "path":
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "phantom":
/***/ (function(module, exports) {

module.exports = require("phantom");

/***/ }),

/***/ "pretty-error":
/***/ (function(module, exports) {

module.exports = require("pretty-error");

/***/ }),

/***/ "prop-types":
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),

/***/ "react":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-dom/server":
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ "react-file-download":
/***/ (function(module, exports) {

module.exports = require("react-file-download");

/***/ }),

/***/ "recharts":
/***/ (function(module, exports) {

module.exports = require("recharts");

/***/ }),

/***/ "sequelize":
/***/ (function(module, exports) {

module.exports = require("sequelize");

/***/ }),

/***/ "serialize-javascript":
/***/ (function(module, exports) {

module.exports = require("serialize-javascript");

/***/ }),

/***/ "universal-router":
/***/ (function(module, exports) {

module.exports = require("universal-router");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlcyI6WyIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvd2VicGFjay9ib290c3RyYXAgY2M1MDkxMDBlODgzZWMyZGYwNjgiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCIuL2Fzc2V0cy5qc29uXCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuY3NzPzZhYzYiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL25vZGVfbW9kdWxlcy9pc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvaW5zZXJ0Q3NzLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvRG93bmxvYWQvaW5kZXguanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2FwaS9hbGxJbmRpYU1hcmtzQW5hbHlzaXNSZXBvcnQvYWxsSW5kaWFNYXJrc0FuYWx5c2lzUmVwb3J0Lm1vZGVsLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvY2FtcHVzVG9wcGVyL2NhbXB1c1RvcHBlci5jb250cm9sbGVyLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvY2FtcHVzVG9wcGVyL2luZGV4LmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvY3d1QW5hbHlzaXNSZXBvcnQvY3d1QW5hbHlzaXNSZXBvcnQubW9kZWwuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2FwaS9mZXRjaERldGFpbHMvZmV0Y2hEZXRhaWxzLmNvbnRyb2xsZXIuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2FwaS9mZXRjaERldGFpbHMvaW5kZXguanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2FwaS9maWxlc0xpc3QvZmlsZXNMaXN0LmNvbnRyb2xsZXIuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2FwaS9maWxlc0xpc3QvZmlsZXNMaXN0Lm1vZGVsLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvZmlsZXNMaXN0L2luZGV4LmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvZ2V0RGF0YS9nZXREYXRhLmNvbnRyb2xsZXIuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2FwaS9nZXREYXRhL2luZGV4LmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvZ3JhcGhEYXRhL2dyYXBoRGF0YS5jb250cm9sbGVyLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvZ3JhcGhEYXRhL2luZGV4LmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvaW5kZXguanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2FwaS9tYXN0ZXJSZXN1bHQvaW5kZXguanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2FwaS9tYXN0ZXJSZXN1bHQvbWFzdGVyUmVzdWx0LmNvbnRyb2xsZXIuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2FwaS9tYXN0ZXJSZXN1bHQvbWFzdGVyUmVzdWx0Lm1vZGVsLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvb3ZlckFsbEF2ZXJhZ2UvaW5kZXguanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2FwaS9vdmVyQWxsQXZlcmFnZS9vdmVyQWxsQXZlcmFnZS5jb250cm9sbGVyLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvc2VjdGlvbkF2ZXJhZ2UvaW5kZXguanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2FwaS9zZWN0aW9uQXZlcmFnZS9zZWN0aW9uQXZlcmFnZS5jb250cm9sbGVyLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvc3R1ZGVudC9pbmRleC5qcyIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9zcmMvYXBpL3N0dWRlbnQvc3R1ZGVudC5jb250cm9sbGVyLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9hcGkvc3R1ZGVudC9zdHVkZW50Lm1vZGVsLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9jb21wb25lbnRzL0FwcC5qcyIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9zcmMvY29tcG9uZW50cy9IdG1sLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9jb25maWcuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2NyZWF0ZUZldGNoLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9kYXRhL21vZGVscy9Vc2VyLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9kYXRhL21vZGVscy9Vc2VyQ2xhaW0uanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2RhdGEvbW9kZWxzL1VzZXJMb2dpbi5qcyIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9zcmMvZGF0YS9tb2RlbHMvVXNlclByb2ZpbGUuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2RhdGEvbW9kZWxzL2luZGV4LmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9kYXRhL3F1ZXJpZXMvQ1dVQW5hbHlzaXNSZXBvcnQuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2RhdGEvcXVlcmllcy9hbGxJbmRpYU1hcmtzQW5hbHlzaXNSZXBvcnQuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2RhdGEvcXVlcmllcy9tZS5qcyIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9zcmMvZGF0YS9xdWVyaWVzL25ld3MuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2RhdGEvc2NoZW1hLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9kYXRhL3NlcXVlbGl6ZS5qcyIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9zcmMvZGF0YS90eXBlcy9BbGxJbmRpYU1hcmtzQW5hbHlzaXNUeXBlLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9kYXRhL3R5cGVzL0NXVUFuYWx5c2lzUmVwb3J0VHlwZS5qcyIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9zcmMvZGF0YS90eXBlcy9OZXdzSXRlbVR5cGUuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL2RhdGEvdHlwZXMvVXNlclR5cGUuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL3Bhc3Nwb3J0LmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9yb3V0ZXIuanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuY3NzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9yb3V0ZXMvZXJyb3IvRXJyb3JQYWdlLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL3NyYy9yb3V0ZXMvZXJyb3IvaW5kZXguanMiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvc3JjL3JvdXRlcy9pbmRleC5qcyIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9zcmMvc2VydmVyLmpzIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwiYXhpb3NcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcImJhYmVsLXBvbHlmaWxsXCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnlcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5XCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJibHVlYmlyZFwiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwiYm9keS1wYXJzZXJcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcImNsYXNzbmFtZXNcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcImNvb2tpZS1wYXJzZXJcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcImNzdi1maWxlLWNyZWF0b3JcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcImNzdmpzb25cIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcImV4cHJlc3MtZ3JhcGhxbFwiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwiZXhwcmVzcy1qd3RcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcImZzXCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJncmFwaHFsXCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJoaXN0b3J5L2NyZWF0ZUJyb3dzZXJIaXN0b3J5XCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJpc29tb3JwaGljLWZldGNoXCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJpc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvd2l0aFN0eWxlc1wiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwianNvbndlYnRva2VuXCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJqc3BkZlwiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwibWF0ZXJpYWwtdWkvRGF0ZVBpY2tlclwiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwibWF0ZXJpYWwtdWkvRGlhbG9nXCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJtYXRlcmlhbC11aS9EcmF3ZXJcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcIm1hdGVyaWFsLXVpL0ZsYXRCdXR0b25cIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcIm1hdGVyaWFsLXVpL0xpc3RcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcIm1hdGVyaWFsLXVpL01lbnVJdGVtXCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJtYXRlcmlhbC11aS9SZWZyZXNoSW5kaWNhdG9yXCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJtYXRlcmlhbC11aS9TZWxlY3RGaWVsZFwiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwibWF0ZXJpYWwtdWkvVGFibGVcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcIm1hdGVyaWFsLXVpL1RleHRGaWVsZFwiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwibWF0ZXJpYWwtdWkvc3R5bGVzL011aVRoZW1lUHJvdmlkZXJcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcIm1hdGVyaWFsLXVpL3N0eWxlcy9iYXNlVGhlbWVzL2xpZ2h0QmFzZVRoZW1lXCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJtYXRlcmlhbC11aS9zdHlsZXMvZ2V0TXVpVGhlbWVcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcIm1vbmdvb3NlXCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJtdWx0ZXJcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcIm5vZGUtZmV0Y2hcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcInBhc3Nwb3J0XCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJwYXNzcG9ydC1mYWNlYm9va1wiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwicGF0aFwiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwicGhhbnRvbVwiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwicHJldHR5LWVycm9yXCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJwcm9wLXR5cGVzXCIiLCIvaG9tZS9hbmlrZXQvaWlpdF9zdHVkeS9zc2FkL3BvbGFyaXMvZXh0ZXJuYWwgXCJyZWFjdFwiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwicmVhY3QtZG9tL3NlcnZlclwiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwicmVhY3QtZmlsZS1kb3dubG9hZFwiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwicmVjaGFydHNcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcInNlcXVlbGl6ZVwiIiwiL2hvbWUvYW5pa2V0L2lpaXRfc3R1ZHkvc3NhZC9wb2xhcmlzL2V4dGVybmFsIFwic2VyaWFsaXplLWphdmFzY3JpcHRcIiIsIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9leHRlcm5hbCBcInVuaXZlcnNhbC1yb3V0ZXJcIiJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0XHR2YXIgY2h1bmsgPSByZXF1aXJlKFwiLi9cIiArIFwidXBkYXRlcy9cIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiKTtcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmsuaWQsIGNodW5rLm1vZHVsZXMpO1xuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRcdHRyeSB7XG4gXHRcdFx0dmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIuL1wiICsgXCJ1cGRhdGVzL1wiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIik7XG4gXHRcdH0gY2F0Y2goZSkge1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiBcdFx0fVxuIFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVwZGF0ZSk7XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7IC8vZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCJjYzUwOTEwMGU4ODNlYzJkZjA2OFwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xyXG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcclxuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdGlmKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XHJcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gXHRcdFx0aWYobWUuaG90LmFjdGl2ZSkge1xyXG4gXHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XHJcbiBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpIDwgMClcclxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpIDwgMClcclxuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiYgbmFtZSAhPT0gXCJlXCIpIHtcclxuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHR0aHJvdyBlcnI7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcclxuIFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xyXG4gXHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH07XHJcbiBcdFx0cmV0dXJuIGZuO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBob3QgPSB7XHJcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXHJcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXHJcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcclxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXHJcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXHJcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXHJcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aWYoIWwpIHJldHVybiBob3RTdGF0dXM7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXHJcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cclxuIFx0XHR9O1xyXG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcclxuIFx0XHRyZXR1cm4gaG90O1xyXG4gXHR9XHJcbiBcdFxyXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcclxuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xyXG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xyXG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90RGVmZXJyZWQ7XHJcbiBcdFxyXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cclxuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcclxuIFx0XHR2YXIgaXNOdW1iZXIgPSAoK2lkKSArIFwiXCIgPT09IGlkO1xyXG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xyXG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcclxuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0Zm9yKHZhciBjaHVua0lkIGluIGluc3RhbGxlZENodW5rcylcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxyXG4gXHRcdFx0cmV0dXJuO1xyXG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0aWYoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xyXG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XHJcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcclxuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcclxuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XHJcbiBcdFx0aWYoIWRlZmVycmVkKSByZXR1cm47XHJcbiBcdFx0aWYoaG90QXBwbHlPblVwZGF0ZSkge1xyXG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cclxuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxyXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxyXG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xyXG4gXHRcdFx0fSkudGhlbihcclxuIFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XHJcbiBcdFx0XHRcdGlmKCFjaGlsZCkgY29udGludWU7XHJcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcclxuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xyXG4gXHRcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcclxuIFx0XHJcbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRcdGlmKGNiKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xyXG4gXHRcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyciwgLy8gVE9ETyByZW1vdmUgaW4gd2VicGFjayA0XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgY2h1bmtzXG4gXHQvLyBcIjBcIiBtZWFucyBcImFscmVhZHkgbG9hZGVkXCJcbiBcdHZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG4gXHRcdDE0OiAwXG4gXHR9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG4gXHQvLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4gXHQvLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3NcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZSA9IGZ1bmN0aW9uIHJlcXVpcmVFbnN1cmUoY2h1bmtJZCkge1xuIFx0XHQvLyBcIjBcIiBpcyB0aGUgc2lnbmFsIGZvciBcImFscmVhZHkgbG9hZGVkXCJcbiBcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdICE9PSAwKSB7XG4gXHRcdFx0dmFyIGNodW5rID0gcmVxdWlyZShcIi4vY2h1bmtzL1wiICsgKHtcIjBcIjpcInZpZXdSZXBvcnRcIixcIjFcIjpcIm5ld1Rlc3RcIixcIjJcIjpcInRlc3RzXCIsXCIzXCI6XCJ0ZXN0VXBsb2FkZWRcIixcIjRcIjpcInVwbG9hZEVycm9yXCIsXCI1XCI6XCJ0ZWFjaGVyc1wiLFwiNlwiOlwic3R1ZGVudHNcIixcIjdcIjpcInNldHRpbmdzXCIsXCI4XCI6XCJyZXBvcnRzXCIsXCI5XCI6XCJob21lXCIsXCIxMFwiOlwiY2FtcHVzXCIsXCIxMVwiOlwiZ3JhcGhzXCIsXCIxMlwiOlwidmlld1JlcG9ydHNcIixcIjEzXCI6XCJub3QtZm91bmRcIn1bY2h1bmtJZF18fGNodW5rSWQpICsgXCIuanNcIik7XG4gXHRcdFx0dmFyIG1vcmVNb2R1bGVzID0gY2h1bmsubW9kdWxlcywgY2h1bmtJZHMgPSBjaHVuay5pZHM7XG4gXHRcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBjaHVua0lkcy5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAwO1xuIFx0XHR9XG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiBcdH07XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Fzc2V0cy9cIjtcblxuIFx0Ly8gdW5jYXRjaGVkIGVycm9yIGhhbmRsZXIgZm9yIHdlYnBhY2sgcnVudGltZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vZSA9IGZ1bmN0aW9uKGVycikge1xuIFx0XHRwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuIFx0XHRcdHRocm93IGVycjsgLy8gY2F0Y2ggdGhpcyBlcnJvciBieSB1c2luZyBTeXN0ZW0uaW1wb3J0KCkuY2F0Y2goKVxuIFx0XHR9KTtcbiBcdH07XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMCkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgY2M1MDkxMDBlODgzZWMyZGYwNjgiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2Fzc2V0cy5qc29uXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiLi9hc3NldHMuanNvblwiXG4vLyBtb2R1bGUgaWQgPSAuL2Fzc2V0cy5qc29uXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLyoqXFxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxcbiAqXFxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxcbiAqXFxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXFxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cXG4gKi9cXG5cXG5odG1sIHtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgLXdlYmtpdC1ib3gtYWxpZ246IGNlbnRlcjtcXG4gICAgICAtbXMtZmxleC1hbGlnbjogY2VudGVyO1xcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgLXdlYmtpdC1ib3gtcGFjazogY2VudGVyO1xcbiAgICAgIC1tcy1mbGV4LXBhY2s6IGNlbnRlcjtcXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBwYWRkaW5nOiAwIDMycHg7XFxuICBwYWRkaW5nOiAwIDJyZW07XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiAjODg4O1xcbn1cXG5cXG5ib2R5IHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuaDEge1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIGNvbG9yOiAjNTU1O1xcbn1cXG5cXG5wcmUge1xcbiAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG59XFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIi9ob21lL2FuaWtldC9paWl0X3N0dWR5L3NzYWQvcG9sYXJpcy9zcmMvcm91dGVzL2Vycm9yL0Vycm9yUGFnZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7Ozs7Ozs7R0FPRzs7QUFFSDtFQUNFLHFCQUFxQjtFQUNyQixxQkFBcUI7RUFDckIsY0FBYztFQUNkLDBCQUEwQjtNQUN0Qix1QkFBdUI7VUFDbkIsb0JBQW9CO0VBQzVCLHlCQUF5QjtNQUNyQixzQkFBc0I7VUFDbEIsd0JBQXdCO0VBQ2hDLGdCQUFnQjtFQUNoQixnQkFBZ0I7RUFDaEIsYUFBYTtFQUNiLHdCQUF3QjtFQUN4QixtQkFBbUI7RUFDbkIsWUFBWTtDQUNiOztBQUVEO0VBQ0UsVUFBVTtDQUNYOztBQUVEO0VBQ0UsaUJBQWlCO0VBQ2pCLFlBQVk7Q0FDYjs7QUFFRDtFQUNFLHNCQUFzQjtFQUN0QixpQkFBaUI7Q0FDbEJcIixcImZpbGVcIjpcIkVycm9yUGFnZS5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyoqXFxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxcbiAqXFxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxcbiAqXFxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXFxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cXG4gKi9cXG5cXG5odG1sIHtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgLXdlYmtpdC1ib3gtYWxpZ246IGNlbnRlcjtcXG4gICAgICAtbXMtZmxleC1hbGlnbjogY2VudGVyO1xcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgLXdlYmtpdC1ib3gtcGFjazogY2VudGVyO1xcbiAgICAgIC1tcy1mbGV4LXBhY2s6IGNlbnRlcjtcXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBwYWRkaW5nOiAwIDMycHg7XFxuICBwYWRkaW5nOiAwIDJyZW07XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGNvbG9yOiAjODg4O1xcbn1cXG5cXG5ib2R5IHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuaDEge1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIGNvbG9yOiAjNTU1O1xcbn1cXG5cXG5wcmUge1xcbiAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wiaW1wb3J0TG9hZGVyc1wiOjEsXCJzb3VyY2VNYXBcIjp0cnVlLFwibW9kdWxlc1wiOnRydWUsXCJsb2NhbElkZW50TmFtZVwiOlwiW25hbWVdLVtsb2NhbF0tW2hhc2g6YmFzZTY0OjVdXCIsXCJtaW5pbWl6ZVwiOmZhbHNlLFwiZGlzY2FyZENvbW1lbnRzXCI6e1wicmVtb3ZlQWxsXCI6dHJ1ZX19IS4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJjb25maWdcIjp7XCJwYXRoXCI6XCIuL3Rvb2xzL3Bvc3Rjc3MuY29uZmlnLmpzXCJ9fSEuL3NyYy9yb3V0ZXMvZXJyb3IvRXJyb3JQYWdlLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz97XCJpbXBvcnRMb2FkZXJzXCI6MSxcInNvdXJjZU1hcFwiOnRydWUsXCJtb2R1bGVzXCI6dHJ1ZSxcImxvY2FsSWRlbnROYW1lXCI6XCJbbmFtZV0tW2xvY2FsXS1baGFzaDpiYXNlNjQ6NV1cIixcIm1pbmltaXplXCI6ZmFsc2UsXCJkaXNjYXJkQ29tbWVudHNcIjp7XCJyZW1vdmVBbGxcIjp0cnVlfX0hLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzP3tcImNvbmZpZ1wiOntcInBhdGhcIjpcIi4vdG9vbHMvcG9zdGNzcy5jb25maWcuanNcIn19IS4vc3JjL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuY3NzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAxNCIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9zdHJpbmdpZnkgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnknKTtcblxudmFyIF9zdHJpbmdpZnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaW5naWZ5KTtcblxudmFyIF9zbGljZWRUb0FycmF5MiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5Jyk7XG5cbnZhciBfc2xpY2VkVG9BcnJheTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zbGljZWRUb0FycmF5Mik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogSXNvbW9ycGhpYyBDU1Mgc3R5bGUgbG9hZGVyIGZvciBXZWJwYWNrXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTUtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcHJlZml4ID0gJ3MnO1xudmFyIGluc2VydGVkID0ge307XG5cbi8vIEJhc2U2NCBlbmNvZGluZyBhbmQgZGVjb2RpbmcgLSBUaGUgXCJVbmljb2RlIFByb2JsZW1cIlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvd0Jhc2U2NC9CYXNlNjRfZW5jb2RpbmdfYW5kX2RlY29kaW5nI1RoZV9Vbmljb2RlX1Byb2JsZW1cbmZ1bmN0aW9uIGI2NEVuY29kZVVuaWNvZGUoc3RyKSB7XG4gIHJldHVybiBidG9hKGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csIGZ1bmN0aW9uIChtYXRjaCwgcDEpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgnMHgnICsgcDEpO1xuICB9KSk7XG59XG5cbi8qKlxuICogUmVtb3ZlIHN0eWxlL2xpbmsgZWxlbWVudHMgZm9yIHNwZWNpZmllZCBub2RlIElEc1xuICogaWYgdGhleSBhcmUgbm8gbG9uZ2VyIHJlZmVyZW5jZWQgYnkgVUkgY29tcG9uZW50cy5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQ3NzKGlkcykge1xuICBpZHMuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICBpZiAoLS1pbnNlcnRlZFtpZF0gPD0gMCkge1xuICAgICAgdmFyIGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcmVmaXggKyBpZCk7XG4gICAgICBpZiAoZWxlbSkge1xuICAgICAgICBlbGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBFeGFtcGxlOlxuICogICAvLyBJbnNlcnQgQ1NTIHN0eWxlcyBvYmplY3QgZ2VuZXJhdGVkIGJ5IGBjc3MtbG9hZGVyYCBpbnRvIERPTVxuICogICB2YXIgcmVtb3ZlQ3NzID0gaW5zZXJ0Q3NzKFtbMSwgJ2JvZHkgeyBjb2xvcjogcmVkOyB9J11dKTtcbiAqXG4gKiAgIC8vIFJlbW92ZSBpdCBmcm9tIHRoZSBET01cbiAqICAgcmVtb3ZlQ3NzKCk7XG4gKi9cbmZ1bmN0aW9uIGluc2VydENzcyhzdHlsZXMpIHtcbiAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9LFxuICAgICAgX3JlZiRyZXBsYWNlID0gX3JlZi5yZXBsYWNlLFxuICAgICAgcmVwbGFjZSA9IF9yZWYkcmVwbGFjZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJHJlcGxhY2UsXG4gICAgICBfcmVmJHByZXBlbmQgPSBfcmVmLnByZXBlbmQsXG4gICAgICBwcmVwZW5kID0gX3JlZiRwcmVwZW5kID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWYkcHJlcGVuZDtcblxuICB2YXIgaWRzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIF9zdHlsZXMkaSA9ICgwLCBfc2xpY2VkVG9BcnJheTMuZGVmYXVsdCkoc3R5bGVzW2ldLCA0KSxcbiAgICAgICAgbW9kdWxlSWQgPSBfc3R5bGVzJGlbMF0sXG4gICAgICAgIGNzcyA9IF9zdHlsZXMkaVsxXSxcbiAgICAgICAgbWVkaWEgPSBfc3R5bGVzJGlbMl0sXG4gICAgICAgIHNvdXJjZU1hcCA9IF9zdHlsZXMkaVszXTtcblxuICAgIHZhciBpZCA9IG1vZHVsZUlkICsgJy0nICsgaTtcblxuICAgIGlkcy5wdXNoKGlkKTtcblxuICAgIGlmIChpbnNlcnRlZFtpZF0pIHtcbiAgICAgIGlmICghcmVwbGFjZSkge1xuICAgICAgICBpbnNlcnRlZFtpZF0rKztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaW5zZXJ0ZWRbaWRdID0gMTtcblxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJlZml4ICsgaWQpO1xuICAgIHZhciBjcmVhdGUgPSBmYWxzZTtcblxuICAgIGlmICghZWxlbSkge1xuICAgICAgY3JlYXRlID0gdHJ1ZTtcblxuICAgICAgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgZWxlbS5pZCA9IHByZWZpeCArIGlkO1xuXG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ21lZGlhJywgbWVkaWEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjc3NUZXh0ID0gY3NzO1xuICAgIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIHNraXAgSUU5IGFuZCBiZWxvdywgc2VlIGh0dHA6Ly9jYW5pdXNlLmNvbS9hdG9iLWJ0b2FcbiAgICAgIGNzc1RleHQgKz0gJ1xcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsJyArIGI2NEVuY29kZVVuaWNvZGUoKDAsIF9zdHJpbmdpZnkyLmRlZmF1bHQpKHNvdXJjZU1hcCkpICsgJyovJztcbiAgICAgIGNzc1RleHQgKz0gJ1xcbi8qIyBzb3VyY2VVUkw9JyArIHNvdXJjZU1hcC5maWxlICsgJz8nICsgaWQgKyAnKi8nO1xuICAgIH1cblxuICAgIGlmICgndGV4dENvbnRlbnQnIGluIGVsZW0pIHtcbiAgICAgIGVsZW0udGV4dENvbnRlbnQgPSBjc3NUZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1RleHQ7XG4gICAgfVxuXG4gICAgaWYgKGNyZWF0ZSkge1xuICAgICAgaWYgKHByZXBlbmQpIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUoZWxlbSwgZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlbW92ZUNzcy5iaW5kKG51bGwsIGlkcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0Q3NzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi9pbnNlcnRDc3MuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi9pbnNlcnRDc3MuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAxNCIsImNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG5cbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbnJvdXRlci5nZXQoJy9kb3dubG9hZCcsIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICBjb25zdCBmaWxlTmFtZSA9IGAuL2NzdkZpbGVzLyR7cmVxLnF1ZXJ5LnRlc3ROYW1lfS5jc3ZgO1xuICByZXMuZG93bmxvYWQoZmlsZU5hbWUpO1xuICByZXMuc3RhdHVzKDIwMCk7XG59KTtcbnJvdXRlci5nZXQoJy9wZGYnLChyZXEsIHJlcywgbmV4dCkgPT4ge1xuXHR2YXIgcGhhbnRvbSA9IHJlcXVpcmUoJ3BoYW50b20nKTsgICBcblx0dmFyIGwgPSAnJztcblx0cGhhbnRvbS5jcmVhdGUoKS50aGVuKGZ1bmN0aW9uKHBoKSB7XG5cdCAgICBwaC5jcmVhdGVQYWdlKCkudGhlbihmdW5jdGlvbihwYWdlKSB7XG5cdCAgICAgICAgcGFnZS5vcGVuKHJlcS5ib2R5LmxpbmspLnRoZW4oZnVuY3Rpb24oc3RhdHVzKSB7XG5cdCAgICAgICAgXHRsID0gJy4vcGRmRmlsZXMvJyArIHJlcS5ib2R5Lmxpbms7XG5cdCAgICAgICAgICAgIHBhZ2UucmVuZGVyKGwpLnRoZW4oZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUGFnZSBSZW5kZXJlZCcpO1xuXHQgICAgICAgICAgICAgICAgcGguZXhpdCgpO1xuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICB9KTtcblx0ICAgIH0pO1xuXHR9KTtcblx0cmVzLnN0YXR1cygyMDApO1xuXHRyZXMuZG93bmxvYWQobCk7XG5cdFx0XG59KVxubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2FwaS9Eb3dubG9hZC9pbmRleC5qcyIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG4vLyBpbXBvcnQge3JlZ2lzdGVyRXZlbnRzfSBmcm9tICcuL3N0dWRlbnQuZXZlbnRzJztcblxuY29uc3QgUmVwb3J0U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XG4gIHJvbGxOdW1iZXI6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgdW5pcXVlOiB0cnVlIH0sXG4gIG5hbWU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxuICBjYW1wdXNJZDogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXG5cbiAgcGh5TWFya3MxMjA6IHsgdHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwIH0sXG4gIGNoZU1hcmtzMTIwOiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdDogMCB9LFxuICBtYXRNYXJrczEyMDogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDAgfSxcblxuICBwaHlSYW5rOiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdDogMCB9LFxuICBjaGVSYW5rOiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdDogMCB9LFxuICBtYXRSYW5rOiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdDogMCB9LFxuXG4gIG92ZXJhbGxNYXJrczogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDAgfSxcbiAgb3ZlcmFsbFJhbms6IHsgdHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwIH0sXG5cbiAgYWN0aXZlOiBCb29sZWFuLFxufSk7XG5cbmNvbnN0IEFsbEluZGlhTWFya3NBbmFseXNpc1JlcG9ydFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xuICB0ZXN0SWQ6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxuICBhY2FkZW1pY1llYXI6IHsgdHlwZTogTnVtYmVyLCByZXF1aXJlZDogdHJ1ZSB9LFxuICByZXBvcnRzOiBbUmVwb3J0U2NoZW1hXSxcbiAgYWN0aXZlOiBCb29sZWFuLFxufSk7XG5cbi8vIHJlZ2lzdGVyRXZlbnRzKHN0dWRlbnRTY2hlbWEpO1xuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoXG4gICdBbGxJbmRpYU1hcmtzQW5hbHlzaXNSZXBvcnQnLFxuICBBbGxJbmRpYU1hcmtzQW5hbHlzaXNSZXBvcnRTY2hlbWEsXG4pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9hcGkvYWxsSW5kaWFNYXJrc0FuYWx5c2lzUmVwb3J0L2FsbEluZGlhTWFya3NBbmFseXNpc1JlcG9ydC5tb2RlbC5qcyIsImltcG9ydCBNYXN0ZXJSZXN1bHQgZnJvbSAnLi4vbWFzdGVyUmVzdWx0L21hc3RlclJlc3VsdC5tb2RlbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b3BwZXIocmVxLCByZXMsIG5leHQpIHtcbiAgTWFzdGVyUmVzdWx0LmZpbmQoe30sIChlcnIsIG1hcmtzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGRhdGEgPSBbXTtcbiAgICBjb25zdCBjYW1wdXNlcyA9IFtdO1xuICAgIGNvbnN0IG51bWJlck9mU3R1ZGVudHMgPSBbXTtcbiAgICBsZXQgY2wgPSAwO1xuICAgIGNvbnN0IGZpbmFsID0gW107XG4gICAgY29uc3Qgc3R1ZGVudHMgPSBbXTtcbiAgICBsZXQgc3R1Y291bnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBmbGFnc3R1ID0gMDtcbiAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgc3R1Y291bnQ7IHArKykge1xuICAgICAgICBpZiAobWFya3NbaV0ucm9sbE51bWJlciA9PSBzdHVkZW50c1twXSkge1xuICAgICAgICAgIGZsYWdzdHUgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZmxhZ3N0dSA9PSAxKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgc3R1ZGVudHNbc3R1Y291bnQrK10gPSBtYXJrc1tpXS5yb2xsTnVtYmVyO1xuICAgICAgbGV0IGZsYWcgPSAwO1xuICAgICAgbGV0IGogPSAwO1xuICAgICAgZm9yIChqID0gMDsgaiA8IGNsOyBqKyspIHtcbiAgICAgICAgaWYgKGNhbXB1c2VzW2pdID09IG1hcmtzW2ldLmNhbXB1c0lkKSB7XG4gICAgICAgICAgZmxhZyA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmbGFnID09IDEpIHtcbiAgICAgICAgc2VuZGRhdGFbal0ucGh5c2ljcy5wdXNoKHtcbiAgICAgICAgICBtYXJrczogbWFya3NbaV0ubWFya0FuYWx5c2lzLlBoeXNpY3Mub2J0YWluZWRNYXJrcyxcbiAgICAgICAgICBuYW1lOiBtYXJrc1tpXS5uYW1lLFxuICAgICAgICB9KTtcbiAgICAgICAgc2VuZGRhdGFbal0uY2hlbWlzdHJ5LnB1c2goe1xuICAgICAgICAgIG1hcmtzOiBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuQ2hlbWlzdHJ5Lm9idGFpbmVkTWFya3MsXG4gICAgICAgICAgbmFtZTogbWFya3NbaV0ubmFtZSxcbiAgICAgICAgfSk7XG4gICAgICAgIHNlbmRkYXRhW2pdLm1hdGhzLnB1c2goe1xuICAgICAgICAgIG1hcmtzOiBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuTWF0aHMub2J0YWluZWRNYXJrcyxcbiAgICAgICAgICBuYW1lOiBtYXJrc1tpXS5uYW1lLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbXB1c2VzW2NsXSA9IG1hcmtzW2ldLmNhbXB1c0lkO1xuICAgICAgICBjbCArPSAxO1xuICAgICAgICBzZW5kZGF0YVtqXSA9IHtcbiAgICAgICAgICBOYW1lOiAnJyxcbiAgICAgICAgICBwaHlzaWNzOiBbeyBtYXJrczogW10sIG5hbWU6ICcnIH1dLFxuICAgICAgICAgIGNoZW1pc3RyeTogW3sgbWFya3M6IFtdLCBuYW1lOiAnJyB9XSxcbiAgICAgICAgICBtYXRoczogW3sgbWFya3M6IFtdLCBuYW1lOiAnJyB9XSxcbiAgICAgICAgfTtcbiAgICAgICAgc2VuZGRhdGFbal0uTmFtZSA9IG1hcmtzW2ldLmNhbXB1c0lkO1xuICAgICAgICBzZW5kZGF0YVtqXS5waHlzaWNzLnB1c2goe1xuICAgICAgICAgIG1hcmtzOiBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuUGh5c2ljcy5vYnRhaW5lZE1hcmtzLFxuICAgICAgICAgIG5hbWU6IG1hcmtzW2ldLm5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgICBzZW5kZGF0YVtqXS5jaGVtaXN0cnkucHVzaCh7XG4gICAgICAgICAgbWFya3M6IG1hcmtzW2ldLm1hcmtBbmFseXNpcy5DaGVtaXN0cnkub2J0YWluZWRNYXJrcyxcbiAgICAgICAgICBuYW1lOiBtYXJrc1tpXS5uYW1lLFxuICAgICAgICB9KTtcbiAgICAgICAgc2VuZGRhdGFbal0ubWF0aHMucHVzaCh7XG4gICAgICAgICAgbWFya3M6IG1hcmtzW2ldLm1hcmtBbmFseXNpcy5NYXRocy5vYnRhaW5lZE1hcmtzLFxuICAgICAgICAgIG5hbWU6IG1hcmtzW2ldLm5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgZmluYWxEYXRhID0gW3tjYW1wdXNfbmFtZTogXCJcIixzdHVkZW50X25hbWU6IFwiXCIsc3ViamVjdDogXCJcIixtYXJrczogMH1dOyAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbDsgaSsrKSB7XG4gICAgICBmaW5hbFtpXSA9IHsgY2FtcHVzTmFtZTogJycsIHBoeXNpY3M6IFtdLCBjaGVtaXN0cnk6IFtdLCBtYXRoczogW10gfTtcbiAgICAgIGZpbmFsW2ldLmNhbXB1c05hbWUgPSBjYW1wdXNlc1tpXTtcbiAgICAgIHNlbmRkYXRhW2ldLnBoeXNpY3Muc29ydCgoYSwgYikgPT4gYS5tYXJrcyAtIGIubWFya3MpO1xuICAgICAgc2VuZGRhdGFbaV0uY2hlbWlzdHJ5LnNvcnQoKGEsIGIpID0+IGEubWFya3MgLSBiLm1hcmtzKTtcbiAgICAgIHNlbmRkYXRhW2ldLm1hdGhzLnNvcnQoKGEsIGIpID0+IGEubWFya3MgLSBiLm1hcmtzKTtcbiAgICAgIGxldCBrID0gMDtcbiAgICAgIGZvciAobGV0IGogPSBzZW5kZGF0YVtpXS5waHlzaWNzLmxlbmd0aCAtIDE7aiA+PSBzZW5kZGF0YVtpXS5waHlzaWNzLmxlbmd0aCAtIDU7ai0tKSBcbiAgICAgIHtcbiAgICAgICAgZmluYWxbaV0ucGh5c2ljc1trXSA9IHNlbmRkYXRhW2ldLnBoeXNpY3Nbal07XG4gICAgICAgIGZpbmFsW2ldLmNoZW1pc3RyeVtrXSA9IHNlbmRkYXRhW2ldLmNoZW1pc3RyeVtqXTtcbiAgICAgICAgZmluYWxbaV0ubWF0aHNba10gPSBzZW5kZGF0YVtpXS5tYXRoc1tqXTtcbiAgICAgICAgZmluYWxEYXRhLnB1c2goe2NhbXB1c19uYW1lIDogY2FtcHVzZXNbaV0gLHN0dWRlbnRfbmFtZTogc2VuZGRhdGFbaV0ucGh5c2ljc1tqXS5uYW1lLHN1YmplY3Q6IFwiUGh5c2ljc1wiLG1hcmtzOiBzZW5kZGF0YVtpXS5waHlzaWNzW2pdLm1hcmtzfSk7XG4gICAgICAgIGsrKztcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGogPSBzZW5kZGF0YVtpXS5waHlzaWNzLmxlbmd0aCAtIDE7aiA+PSBzZW5kZGF0YVtpXS5waHlzaWNzLmxlbmd0aCAtIDU7ai0tKSBcbiAgICAgIHtcbiAgICAgICAgZmluYWxEYXRhLnB1c2goe2NhbXB1c19uYW1lIDogY2FtcHVzZXNbaV0sc3R1ZGVudF9uYW1lOiBzZW5kZGF0YVtpXS5jaGVtaXN0cnlbal0ubmFtZSxzdWJqZWN0OiBcIkNoZW1pc3RyeVwiLG1hcmtzOiBzZW5kZGF0YVtpXS5jaGVtaXN0cnlbal0ubWFya3N9KTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGogPSBzZW5kZGF0YVtpXS5waHlzaWNzLmxlbmd0aCAtIDE7aiA+PSBzZW5kZGF0YVtpXS5waHlzaWNzLmxlbmd0aCAtIDU7ai0tKSBcbiAgICAgIHtcbiAgICAgICAgZmluYWxEYXRhLnB1c2goe2NhbXB1c19uYW1lIDogY2FtcHVzZXNbaV0sc3R1ZGVudF9uYW1lOiBzZW5kZGF0YVtpXS5tYXRoc1tqXS5uYW1lLHN1YmplY3Q6IFwiTWF0aGVtYXRpY3NcIixtYXJrczogc2VuZGRhdGFbaV0ubWF0aHNbal0ubWFya3N9KTtcbiAgICAgIH1cblxuICAgICAgLy8gY29uc29sZS5sb2coZmluYWxEYXRhKTtcbiAgICB9XG4gICAgZmluYWxEYXRhLnNwbGljZSgwLDEpO1xuICAgIGNvbnN0IHRlc3ROYW1lcyA9IFtdO1xuICAgIGxldCB0ZXN0ID0gMDtcbiAgICBsZXQgdGZsYWcgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiSGVsbG9cIik7XG4gICAgICB0ZmxhZyA9IDA7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRlc3Q7IGorKykge1xuICAgICAgICBpZiAobWFya3NbaV0udGVzdE5hbWUgPT0gdGVzdE5hbWVzW2pdKSB7XG4gICAgICAgICAgdGZsYWcgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXRmbGFnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiMm5kIGlmXCIpO1xuICAgICAgICB0ZXN0TmFtZXNbdGVzdF0gPSBtYXJrc1tpXS50ZXN0TmFtZTtcbiAgICAgICAgdGVzdCsrO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygndGVzdCcgKyB0ZXN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgY3N2RmlsZSA9IHJlcXVpcmUoJ2Nzdi1maWxlLWNyZWF0b3InKTtcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IHRlc3Q7IGsrKykge1xuICAgICAgbGV0IGwgPSAxO1xuICAgICAgY29uc3QgZGF0YSA9IFtcbiAgICAgICAgWydDYW1wdXMgTmFtZScsICdOYW1lJywgJ1N1YmplY3QnLCAnU3ViamVjdCBSYW5rJywgJ1N1YmplY3QgTWFya3MnXSxcbiAgICAgIF07XG4gICAgICBkYXRhWzBdID0gW1xuICAgICAgICAnQ2FtcHVzIE5hbWUnLFxuICAgICAgICAnTmFtZScsXG4gICAgICAgICdTdWJqZWN0JyxcbiAgICAgICAgJ1N1YmplY3QgUmFuaycsXG4gICAgICAgICdTdWJqZWN0IE1hcmtzJyxcbiAgICAgIF07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA1OyBqKyspIHtcbiAgICAgICAgICBkYXRhW2wrK10gPSBbXG4gICAgICAgICAgICBmaW5hbFtpXS5jYW1wdXNOYW1lLFxuICAgICAgICAgICAgZmluYWxbaV0ucGh5c2ljc1tqXS5uYW1lLFxuICAgICAgICAgICAgJ1BoeXNpY3MnLFxuICAgICAgICAgICAgaiArIDEsXG4gICAgICAgICAgICBmaW5hbFtpXS5waHlzaWNzW2pdLm1hcmtzLFxuICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA1OyBqKyspIHtcbiAgICAgICAgICBkYXRhW2wrK10gPSBbXG4gICAgICAgICAgICBmaW5hbFtpXS5jYW1wdXNOYW1lLFxuICAgICAgICAgICAgZmluYWxbaV0uY2hlbWlzdHJ5W2pdLm5hbWUsXG4gICAgICAgICAgICAnQ2hlbWlzdHJ5JyxcbiAgICAgICAgICAgIGogKyAxLFxuICAgICAgICAgICAgZmluYWxbaV0uY2hlbWlzdHJ5W2pdLm1hcmtzLFxuICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA1OyBqKyspIHtcbiAgICAgICAgICBkYXRhW2wrK10gPSBbXG4gICAgICAgICAgICBmaW5hbFtpXS5jYW1wdXNOYW1lLFxuICAgICAgICAgICAgZmluYWxbaV0ubWF0aHNbal0ubmFtZSxcbiAgICAgICAgICAgICdNYXRocycsXG4gICAgICAgICAgICBqICsgMSxcbiAgICAgICAgICAgIGZpbmFsW2ldLm1hdGhzW2pdLm1hcmtzLFxuICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG5hbWUgPSBgLi9jc3ZGaWxlcy8ke3Rlc3ROYW1lc1trXX1fQ2FtcHVzX1N1YmplY3RfVG9wcGVyLmNzdmA7XG4gICAgICBjc3ZGaWxlKG5hbWUsIGRhdGEpO1xuICAgIH1cblxuICAgIGlmIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGZpbmFsKTtcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKGZpbmFsRGF0YSk7XG4gICAgfVxuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYW1wdXNUb3BwZXIocmVxLCByZXMsIG5leHQpIHtcbiAgTWFzdGVyUmVzdWx0LmZpbmQoe30sIChlcnIsIG1hcmtzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGRhdGEgPSBbXTtcbiAgICBjb25zdCBjYW1wdXNlcyA9IFtdO1xuICAgIGNvbnN0IG51bWJlck9mU3R1ZGVudHMgPSBbXTtcbiAgICBsZXQgY2wgPSAwO1xuICAgIGNvbnN0IGZpbmFsID0gW107XG4gICAgY29uc3Qgc3R1ZGVudHMgPSBbXTtcbiAgICBsZXQgc3R1Y291bnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBmbGFnc3R1ID0gMDtcbiAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgc3R1Y291bnQ7IHArKykge1xuICAgICAgICBpZiAobWFya3NbaV0ucm9sbE51bWJlciA9PSBzdHVkZW50c1twXSkge1xuICAgICAgICAgIGZsYWdzdHUgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZmxhZ3N0dSA9PSAxKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgc3R1ZGVudHNbc3R1Y291bnQrK10gPSBtYXJrc1tpXS5yb2xsTnVtYmVyO1xuICAgICAgbGV0IGZsYWcgPSAwO1xuICAgICAgbGV0IGogPSAwO1xuICAgICAgZm9yIChqID0gMDsgaiA8IGNsOyBqKyspIHtcbiAgICAgICAgaWYgKGNhbXB1c2VzW2pdID09IG1hcmtzW2ldLmNhbXB1c0lkKSB7XG4gICAgICAgICAgZmxhZyA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmbGFnID09IDEpIHtcbiAgICAgICAgc2VuZGRhdGFbal0udG90YWwucHVzaCh7XG4gICAgICAgICAgbmFtZTogbWFya3NbaV0ubmFtZSxcbiAgICAgICAgICBtYXJrczogbWFya3NbaV0ubWFya0FuYWx5c2lzLm92ZXJhbGwub2J0YWluZWRNYXJrcyxcbiAgICAgICAgICBwaHlzaWNzOiBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuUGh5c2ljcy5vYnRhaW5lZE1hcmtzLFxuICAgICAgICAgIGNoZW1pc3RyeTogbWFya3NbaV0ubWFya0FuYWx5c2lzLkNoZW1pc3RyeS5vYnRhaW5lZE1hcmtzLFxuICAgICAgICAgIG1hdGhzOiBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuTWF0aHMub2J0YWluZWRNYXJrcyxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYW1wdXNlc1tjbF0gPSBtYXJrc1tpXS5jYW1wdXNJZDtcbiAgICAgICAgY2wgKz0gMTtcbiAgICAgICAgc2VuZGRhdGFbal0gPSB7XG4gICAgICAgICAgTmFtZTogJycsXG4gICAgICAgICAgdG90YWw6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJycsIG1hcmtzOiBbXSwgcGh5c2ljczogJycsIGNoZW1pc3RyeTogJycsIG1hdGhzOiAnJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH07XG4gICAgICAgIHNlbmRkYXRhW2pdLk5hbWUgPSBtYXJrc1tpXS5jYW1wdXNJZDtcbiAgICAgICAgc2VuZGRhdGFbal0udG90YWwucHVzaCh7XG4gICAgICAgICAgbmFtZTogbWFya3NbaV0ubmFtZSxcbiAgICAgICAgICBtYXJrczogbWFya3NbaV0ubWFya0FuYWx5c2lzLm92ZXJhbGwub2J0YWluZWRNYXJrcyxcbiAgICAgICAgICBwaHlzaWNzOiBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuUGh5c2ljcy5vYnRhaW5lZE1hcmtzLFxuICAgICAgICAgIGNoZW1pc3RyeTogbWFya3NbaV0ubWFya0FuYWx5c2lzLkNoZW1pc3RyeS5vYnRhaW5lZE1hcmtzLFxuICAgICAgICAgIG1hdGhzOiBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuTWF0aHMub2J0YWluZWRNYXJrcyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBmaW5hbERhdGEgPSBbe2NhbXB1c19uYW1lOiBcIlwiLHN0dWRlbnRfbmFtZTogXCJcIixyYW5rOiAwLHBoeXNpY3M6IDAsY2hlbWlzdHJ5OiAwLG1hdGhzOiAwLHRvdGFsOiAwfV07ICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsOyBpKyspIHtcbiAgICAgIGZpbmFsW2ldID0geyBjYW1wdXNOYW1lOiAnJywgdG9wcGVyOiBbeyByYW5rOiAnJywgdG90YWw6ICcnIH1dIH07XG4gICAgICBmaW5hbFtpXS5jYW1wdXNOYW1lID0gY2FtcHVzZXNbaV07XG4gICAgICBzZW5kZGF0YVtpXS50b3RhbC5zb3J0KChhLCBiKSA9PiBiLm1hcmtzIC0gYS5tYXJrcyk7XG4gICAgICBsZXQgayA9IDA7XG4gICAgICBmaW5hbFtpXS50b3BwZXIucG9wKCk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDU7IGorKykge1xuICAgICAgICBmaW5hbFtpXS50b3BwZXIucHVzaCh7IHJhbms6IGogKyAxLCB0b3RhbDogc2VuZGRhdGFbaV0udG90YWxbal0gfSk7XG4gICAgICAgIGsrKztcbiAgICAgICAgZmluYWxEYXRhLnB1c2goe2NhbXB1c19uYW1lOiBjYW1wdXNlc1tpXSxzdHVkZW50X25hbWU6IGZpbmFsW2ldLnRvcHBlcltqXS50b3RhbC5uYW1lLHJhbms6IGorMSxwaHlzaWNzOiBmaW5hbFtpXS50b3BwZXJbal0udG90YWwucGh5c2ljcywgY2hlbWlzdHJ5OiBmaW5hbFtpXS50b3BwZXJbal0udG90YWwuY2hlbWlzdHJ5LG1hdGhzOiBmaW5hbFtpXS50b3BwZXJbal0udG90YWwubWF0aHMsdG90YWw6IGZpbmFsW2ldLnRvcHBlcltqXS50b3RhbC5tYXJrc30pXG4gICAgICB9XG4gICAgfSBcbiAgICBjb25zdCB0ZXN0TmFtZXMgPSBbXTtcbiAgICBsZXQgdGVzdCA9IDA7XG4gICAgbGV0IHRmbGFnID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkhlbGxvXCIpO1xuICAgICAgdGZsYWcgPSAwO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0ZXN0OyBqKyspIHtcbiAgICAgICAgaWYgKG1hcmtzW2ldLnRlc3ROYW1lID09IHRlc3ROYW1lc1tqXSkge1xuICAgICAgICAgIHRmbGFnID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCF0ZmxhZykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIjJuZCBpZlwiKTtcbiAgICAgICAgdGVzdE5hbWVzW3Rlc3RdID0gbWFya3NbaV0udGVzdE5hbWU7XG4gICAgICAgIHRlc3QrKztcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3Rlc3QnICsgdGVzdCk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGNzdkZpbGUgPSByZXF1aXJlKCdjc3YtZmlsZS1jcmVhdG9yJyk7XG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCB0ZXN0OyBrKyspIHtcbiAgICAgIGxldCBsID0gMTtcbiAgICAgIGNvbnN0IGRhdGEgPSBbXG4gICAgICAgIFtcbiAgICAgICAgICAnQ2FtcHVzIE5hbWUnLFxuICAgICAgICAgICdSYW5rJyxcbiAgICAgICAgICAnTmFtZScsXG4gICAgICAgICAgJ1RvdGFsIE1hcmtzJyxcbiAgICAgICAgICAnUGh5c2ljcyBNYXJrcycsXG4gICAgICAgICAgJ0NoZW1pc3RyeSBNYXJrcycsXG4gICAgICAgICAgJ01hdGhzIE1hcmtzJyxcbiAgICAgICAgXSxcbiAgICAgIF07XG4gICAgICBkYXRhWzBdID0gW1xuICAgICAgICAnQ2FtcHVzIE5hbWUnLFxuICAgICAgICAnUmFuaycsXG4gICAgICAgICdOYW1lJyxcbiAgICAgICAgJ1RvdGFsIE1hcmtzJyxcbiAgICAgICAgJ1BoeXNpY3MgTWFya3MnLFxuICAgICAgICAnQ2hlbWlzdHJ5IE1hcmtzJyxcbiAgICAgICAgJ01hdGhzIE1hcmtzJyxcbiAgICAgIF07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA1OyBqKyspIHtcbiAgICAgICAgICBkYXRhW2wrK10gPSBbXG4gICAgICAgICAgICBmaW5hbFtpXS5jYW1wdXNOYW1lLFxuICAgICAgICAgICAgZmluYWxbaV0udG9wcGVyW2pdLnJhbmssXG4gICAgICAgICAgICBmaW5hbFtpXS50b3BwZXJbal0udG90YWwubmFtZSxcbiAgICAgICAgICAgIGZpbmFsW2ldLnRvcHBlcltqXS50b3RhbC5tYXJrcyxcbiAgICAgICAgICAgIGZpbmFsW2ldLnRvcHBlcltqXS50b3RhbC5waHlzaWNzLFxuICAgICAgICAgICAgZmluYWxbaV0udG9wcGVyW2pdLnRvdGFsLmNoZW1pc3RyeSxcbiAgICAgICAgICAgIGZpbmFsW2ldLnRvcHBlcltqXS50b3RhbC5tYXRocyxcbiAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBuYW1lID0gYC4vY3N2RmlsZXMvJHt0ZXN0TmFtZXNba119X0NhbXB1c19Ub3BwZXIuY3N2YDtcbiAgICAgIGNzdkZpbGUobmFtZSwgZGF0YSk7XG4gICAgfVxuICAgIGZpbmFsRGF0YS5zcGxpY2UoMCwxKTtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhmaW5hbCk7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChmaW5hbERhdGEpO1xuICAgIH1cbiAgfSk7XG59XG5leHBvcnQgZGVmYXVsdCB7XG4gIHRvcHBlcixcbiAgY2FtcHVzVG9wcGVyLFxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBpL2NhbXB1c1RvcHBlci9jYW1wdXNUb3BwZXIuY29udHJvbGxlci5qcyIsImNvbnN0IGNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NhbXB1c1RvcHBlci5jb250cm9sbGVyJyk7XG5jb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG5yb3V0ZXIuZ2V0KCcvdG9wcGVyJywgY29udHJvbGxlci50b3BwZXIpO1xucm91dGVyLmdldCgnL2NhbXB1c1RvcHBlcicsIGNvbnRyb2xsZXIuY2FtcHVzVG9wcGVyKTtcbm1vZHVsZS5leHBvcnRzID0gcm91dGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9hcGkvY2FtcHVzVG9wcGVyL2luZGV4LmpzIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcbi8vIGltcG9ydCB7cmVnaXN0ZXJFdmVudHN9IGZyb20gJy4vc3R1ZGVudC5ldmVudHMnO1xuXG5jb25zdCBSZXBvcnRTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcbiAgcm9sbE51bWJlcjogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlLCB1bmlxdWU6IHRydWUgfSxcbiAgbmFtZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gIGNhbXB1c0lkOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcblxuICBQaHlzaWNzX0M6IHsgdHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwIH0sXG4gIFBoeXNpY3NfVzogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDAgfSxcbiAgUGh5c2ljc19VOiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdDogMCB9LFxuXG4gIENoZW1pc3RyeV9DOiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdDogMCB9LFxuICBDaGVtaXN0cnlfVzogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDAgfSxcbiAgQ2hlbWlzdHJ5X1U6IHsgdHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwIH0sXG5cbiAgTWF0aHNfQzogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDAgfSxcbiAgTWF0aHNfVzogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDAgfSxcbiAgTWF0aHNfVTogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDAgfSxcblxuICBhY3RpdmU6IEJvb2xlYW4sXG59KTtcblxuY29uc3QgQ1dVQW5hbHlzaXNSZXBvcnRTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcbiAgdGVzdElkOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgYWNhZGVtaWNZZWFyOiB7IHR5cGU6IE51bWJlciwgcmVxdWlyZWQ6IHRydWUgfSxcbiAgcmVwb3J0czogW1JlcG9ydFNjaGVtYV0sXG4gIGFjdGl2ZTogQm9vbGVhbixcbn0pO1xuXG4vLyByZWdpc3RlckV2ZW50cyhzdHVkZW50U2NoZW1hKTtcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVsKCdDV1VBbmFseXNpc1JlcG9ydCcsIENXVUFuYWx5c2lzUmVwb3J0U2NoZW1hKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBpL2N3dUFuYWx5c2lzUmVwb3J0L2N3dUFuYWx5c2lzUmVwb3J0Lm1vZGVsLmpzIiwiaW1wb3J0IE1hc3RlclJlc3VsdCBmcm9tICcuLi9tYXN0ZXJSZXN1bHQvbWFzdGVyUmVzdWx0Lm1vZGVsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbENhbXB1c2VzKG1hcmtzKSB7XG4gIGNvbnN0IGNhbXB1c2VzID0gW107XG4gIGxldCBjbCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya3MubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgZmxhZyA9IDA7XG4gICAgbGV0IGogPSAwO1xuICAgIGZvciAoaiA9IDA7IGogPCBjbDsgaisrKSB7XG4gICAgICBpZiAoY2FtcHVzZXNbal0gPT0gbWFya3NbaV0uY2FtcHVzSWQpIHtcbiAgICAgICAgZmxhZyA9IDE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmbGFnID09IDEpIHtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FtcHVzZXNbY2xdID0gbWFya3NbaV0uY2FtcHVzSWQ7XG4gICAgICBjbCArPSAxO1xuICAgIH1cbiAgfVxuICAvLyBmb3IgKGxldCBpID0gMDtpPGNhbXB1c2VzLmxlbmd0aDtpKyspXG4gIC8vIHtcbiAgLy8gXHRjb25zb2xlLmxvZyhjYW1wdXNlc1tpXSArICdpbnNpZGUgY2FtcHVzZXMnKTtcbiAgLy8gfVxuICByZXR1cm4gY2FtcHVzZXM7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsU2VjdGlvbnMoY2FtcHVzLCBtYXJrcykge1xuICBsZXQgbnVtU2VjID0gMDtcbiAgY29uc3Qgc2VjdGlvbnMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXJrcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBmbGFnID0gMDtcbiAgICBpZiAobWFya3NbaV0uY2FtcHVzSWQgPT0gY2FtcHVzKSB7XG4gICAgICBmbGFnID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChmbGFnID09IDEpIHtcbiAgICAgIGxldCBmbGFnU2VjID0gMDtcbiAgICAgIGxldCBrID0gMDtcbiAgICAgIGZvciAoayA9IDA7IGsgPCBudW1TZWM7IGsrKykge1xuICAgICAgICBpZiAobWFya3NbaV0uc2VjdGlvbklkID09IHNlY3Rpb25zW2tdKSB7XG4gICAgICAgICAgZmxhZ1NlYyA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmbGFnU2VjID09IDApIHtcbiAgICAgICAgc2VjdGlvbnNbbnVtU2VjXSA9IG1hcmtzW2ldLnNlY3Rpb25JZDtcbiAgICAgICAgbnVtU2VjICs9IDE7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIHNlY3Rpb25zLnNoaWZ0KCk7XG4gIC8vICAgIGZvcihsZXQgaSA9IDA7aTxzZWN0aW9ucy5sZW5ndGg7aSsrKVxuICAvLyB7XG4gIC8vIFx0Y29uc29sZS5sb2coc2VjdGlvbnNbaV0gKyAnaW5zaWRlIGZ1bmN0aW9uJyk7XG4gIC8vIH1cbiAgcmV0dXJuIHNlY3Rpb25zO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0dWRlbnROYW1lcyhjYW1wdXMsIHNlY3Rpb24sIG1hcmtzKSB7XG4gIGxldCBudW1TdHUgPSAwO1xuICBjb25zdCBzdHVkZW50cyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGZsYWcgPSAwO1xuICAgIGlmIChtYXJrc1tpXS5jYW1wdXNJZCA9PSBjYW1wdXMgJiYgbWFya3NbaV0uc2VjdGlvbklkID09IHNlY3Rpb24pIHtcbiAgICAgIGZsYWcgPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKGZsYWcgPT0gMSkge1xuICAgICAgbGV0IGZsYWdTdHUgPSAwO1xuICAgICAgbGV0IGsgPSAwO1xuICAgICAgZm9yIChrID0gMDsgayA8IG51bVN0dTsgaysrKSB7XG4gICAgICAgIGlmIChtYXJrc1tpXS5yb2xsTnVtYmVyID09IHN0dWRlbnRzW2tdKSB7XG4gICAgICAgICAgZmxhZ1N0dSA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmbGFnU3R1ID09IDApIHtcbiAgICAgICAgc3R1ZGVudHNbbnVtU3R1XSA9IG1hcmtzW2ldLnJvbGxOdW1iZXI7XG4gICAgICAgIG51bVN0dSArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBzdHVkZW50cy5zaGlmdCgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc29sZS5sb2coYCR7c3R1ZGVudHNbaV19aW5zaWRlIGZ1bmN0aW9uYCk7XG4gIH1cbiAgcmV0dXJuIHN0dWRlbnRzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0dWRlbnREZXRhaWxzKHJvbGwsIG1hcmtzKSB7XG4gIGNvbnN0IHN0dWRlbnREZXRhaWxzID0geyByb2xsTnVtYmVyOiAnJywgbmFtZTogJycsIGNhbXB1czogJycsIHNlY3Rpb246ICcnIH07XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXJrcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChtYXJrc1tpXS5yb2xsTnVtYmVyID09IHJvbGwpIHtcbiAgICAgIHN0dWRlbnREZXRhaWxzLnJvbGxOdW1iZXIgPSBtYXJrc1tpXS5yb2xsTnVtYmVyO1xuICAgICAgc3R1ZGVudERldGFpbHMubmFtZSA9IG1hcmtzW2ldLm5hbWU7XG4gICAgICBzdHVkZW50RGV0YWlscy5jYW1wdXMgPSBtYXJrc1tpXS5jYW1wdXNJZDtcbiAgICAgIHN0dWRlbnREZXRhaWxzLnNlY3Rpb24gPSBtYXJrc1tpXS5zZWN0aW9uSWQ7XG4gICAgfVxuICB9XG4gIC8vIGNvbnNvbGUubG9nKCdpbnNpZGUgZnVuY3Rpb24nICsgc3R1ZGVudERldGFpbHMuY2FtcHVzKTtcbiAgcmV0dXJuIHN0dWRlbnREZXRhaWxzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRhdGEocmVxLCByZXMsIG5leHQpIHtcbiAgTWFzdGVyUmVzdWx0LmZpbmQoe30sIChlcnIsIG1hcmtzKSA9PiB7XG4gICAgY29uc3QgYWxsRGF0YSA9IHtcbiAgICAgIGNhbXB1c2VzOiBbXSxcbiAgICAgIHNlY3Rpb25zOiBbXSxcbiAgICAgIHN0dWRlbnRzOiBbXSxcbiAgICAgIHN0dWRlbnREZXRhaWxzOiB7IHJvbGxOdW1iZXI6ICcnLCBuYW1lOiAnJywgY2FtcHVzOiAnJywgc2VjdGlvbjogJycgfSxcbiAgICB9O1xuICAgIGlmICghcmVxLmJvZHkuY2FtcHVzKSB7XG4gICAgICAvLyBjYW1wdXMgbmFtZSBpcyBOVUxMXG4gICAgICBhbGxEYXRhLmNhbXB1c2VzID0gZ2V0QWxsQ2FtcHVzZXMobWFya3MpO1xuICAgICAgLy8gZm9yKGxldCBpID0gMDtpPGFsbERhdGEuY2FtcHVzZXMubGVuZ3RoO2krKylcbiAgICAgIC8vIHtcbiAgICAgIC8vIFx0Y29uc29sZS5sb2coYWxsRGF0YS5jYW1wdXNlc1tpXSk7XG4gICAgICAvLyB9XG4gICAgfSBlbHNlIGlmICghcmVxLmJvZHkuc2VjdGlvbikge1xuICAgICAgLy8gY2FtcHVzIG5hbWUgaXMgbm90IE5VTEwgYW5kIHNlY3Rpb24gbmFtZSBpcyBOVUxMXG4gICAgICB2YXIgY2FtcHVzID0gcmVxLmJvZHkuY2FtcHVzO1xuICAgICAgYWxsRGF0YS5zZWN0aW9ucyA9IGdldEFsbFNlY3Rpb25zKGNhbXB1cywgbWFya3MpO1xuICAgICAgLy8gZm9yKGxldCBpID0gMDtpPGFsbERhdGEuc2VjdGlvbnMubGVuZ3RoO2krKylcbiAgICAgIC8vIHtcbiAgICAgIC8vIFx0Y29uc29sZS5sb2coYWxsRGF0YS5zZWN0aW9uc1tpXSk7XG4gICAgICAvLyB9XG4gICAgfSBlbHNlIGlmICghcmVxLmJvZHkucm9sbG5vKSB7XG4gICAgICAvLyBjYW1wdXMgbmFtZSBhbmQgc2VjdGlvbiBuYW1lIGFyZSBib3RoIG5vdCBudWxsIGFuZCBzdHVkZW50IHJvbGwgbnVtYmVyIGlzIG51bGxcbiAgICAgIHZhciBjYW1wdXMgPSByZXEuYm9keS5jYW1wdXM7XG4gICAgICBjb25zdCBzZWN0aW9uID0gcmVxLmJvZHkuc2VjdGlvbjtcbiAgICAgIGFsbERhdGEuc3R1ZGVudHMgPSBnZXRTdHVkZW50TmFtZXMoY2FtcHVzLCBzZWN0aW9uLCBtYXJrcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJvbGwgPSByZXEuYm9keS5yb2xsO1xuICAgICAgYWxsRGF0YS5zdHVkZW50RGV0YWlscyA9IGdldFN0dWRlbnREZXRhaWxzKHJvbGwsIG1hcmtzKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpbnNpZGUgbWFpbicgKyBhbGxEYXRhLnN0dWRlbnREZXRhaWxzLmNhbXB1cyk7XG4gICAgfVxuICAgIGlmIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKGFsbERhdGEpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSxcbiAgZ2V0QWxsQ2FtcHVzZXMsXG4gIGdldEFsbFNlY3Rpb25zLFxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBpL2ZldGNoRGV0YWlscy9mZXRjaERldGFpbHMuY29udHJvbGxlci5qcyIsImNvbnN0IGNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2ZldGNoRGV0YWlscy5jb250cm9sbGVyJyk7XG5jb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xucm91dGVyLmdldCgnL2RhdGEnLCBjb250cm9sbGVyLmRhdGEpO1xubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2FwaS9mZXRjaERldGFpbHMvaW5kZXguanMiLCJpbXBvcnQgRmlsZXNMaXN0IGZyb20gJy4vZmlsZXNMaXN0Lm1vZGVsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExpc3QocmVxLCByZXMpIHtcbiAgRmlsZXNMaXN0LmZpbmQoe30sIChlcnIsIGRvY3MpID0+IHtcbiAgICBjb25zdCBhID0gW107XG4gICAgY29uc29sZS5sb2coZG9jcy5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZG9jcy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgY29uc3QgZmlsZXMgPSB7IHRlc3RuYW1lOiAnJywgZGF0ZTogJycsIGNoZWNrOiAnJyB9O1xuICAgICAgZmlsZXMudGVzdG5hbWUgPSBkb2NzW2ldLnRlc3RuYW1lO1xuICAgICAgLy8gZmlsZXMuZmlsZW5hbWUgPSBkb2NzW2ldLmZpbGVuYW1lO1xuICAgICAgLy8gY29uc29sZS5sb2coaSk7XG4gICAgICBmaWxlcy5kYXRlID0gZG9jc1tpXS5kYXRldXBsb2FkZWQudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XG4gICAgICBmaWxlcy5jaGVjayA9IHRydWU7XG4gICAgICBhLnB1c2goZmlsZXMpO1xuICAgICAgLy8gY29uc29sZS5sb2coZmlsZXMuZGF0ZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VuZGRhdGEgPSB7IGZpbGVkZXRhaWxzOiBhLCBhbGxSZXN1bHRzOiBbXSB9O1xuICAgIHNlbmRkYXRhLmFsbFJlc3VsdHMucHVzaChbXG4gICAgICAnT3ZlcmFsbCBBdmVyYWdlIGFjcm9zcyBhbGwgQ2FtcHVzZXMnLFxuICAgICAgJy9hcGkvb3ZlckFsbEF2ZXJhZ2VzL3RvdGFsJyxcbiAgICBdKTtcbiAgICBzZW5kZGF0YS5hbGxSZXN1bHRzLnB1c2goW1xuICAgICAgJ092ZXJhbGwgQXZlcmFnZSBhY3Jvc3MgYSBwYXJ0aWN1bGFyIENhbXB1cycsXG4gICAgICAnL2FwaS9vdmVyQWxsQXZlcmFnZXMvY2FtcHVzJyxcbiAgICBdKTtcbiAgICBzZW5kZGF0YS5hbGxSZXN1bHRzLnB1c2goW1xuICAgICAgJ1N1YmplY3QgdG9wcGVyIGFjcm9zcyBhIHBhcnRpY3VsYXIgQ2FtcHVzJyxcbiAgICAgICcvYXBpL2NhbXB1c1RvcHBlcnMvdG9wcGVyJyxcbiAgICBdKTtcbiAgICBzZW5kZGF0YS5hbGxSZXN1bHRzLnB1c2goW1xuICAgICAgJ092ZXJhbGwgdG9wcGVyIGFjcm9zcyBhIHBhcnRpY3VsYXIgQ2FtcHVzJyxcbiAgICAgICcvYXBpL2NhbXB1c1RvcHBlcnMvY2FtcHVzVG9wcGVyJyxcbiAgICBdKTtcbiAgICBzZW5kZGF0YS5hbGxSZXN1bHRzLnB1c2goW1xuICAgICAgJ092ZXJhbGwgQXZlcmFnZSBhY3Jvc3MgYSBwYXJ0aWN1bGFyIFNlY3Rpb24nLFxuICAgICAgJy9hcGkvc2VjdGlvbkF2ZXJhZ2VzL3NlY3Rpb24nLFxuICAgIF0pO1xuICAgIHNlbmRkYXRhLmFsbFJlc3VsdHMucHVzaChbXG4gICAgICAnT3ZlcmFsbCB0b3BwZXIgYWNyb3NzIGEgcGFydGljdWxhciBTZWN0aW9uJyxcbiAgICAgICcvYXBpL3NlY3Rpb25BdmVyYWdlcy9zZWN0aW9uVG9wcGVycycsXG4gICAgXSk7XG4gICAgaWYgKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoc2VuZGRhdGEpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0TGlzdCxcbn07XG4vL1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9hcGkvZmlsZXNMaXN0L2ZpbGVzTGlzdC5jb250cm9sbGVyLmpzIiwiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcblxuY29uc3QgRmlsZXNMaXN0U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XG4gIGZpbGVuYW1lOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgdGVzdG5hbWU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxuICBkYXRldXBsb2FkZWQ6IHsgdHlwZTogRGF0ZSwgcmVxdWlyZWQ6IHRydWUgfSxcbiAgY2hlY2s6IHsgdHlwZTogQm9vbGVhbiwgcmVxdWlyZWQ6IHRydWUgfSxcbiAgYWN0aXZlOiBCb29sZWFuLFxufSk7XG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbCgnRmlsZXNMaXN0JywgRmlsZXNMaXN0U2NoZW1hKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBpL2ZpbGVzTGlzdC9maWxlc0xpc3QubW9kZWwuanMiLCJjb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuY29uc3QgY29udHJvbGxlciA9IHJlcXVpcmUoJy4vZmlsZXNMaXN0LmNvbnRyb2xsZXInKTtcblxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxucm91dGVyLmdldCgnL2dldExpc3QnLCBjb250cm9sbGVyLmdldExpc3QpO1xubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2FwaS9maWxlc0xpc3QvaW5kZXguanMiLCJpbXBvcnQgTWFzdGVyUmVzdWx0IGZyb20gJy4uL21hc3RlclJlc3VsdC9tYXN0ZXJSZXN1bHQubW9kZWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWxsRGF0YShtYXJrcykge1xuICBjb25zdCBzZW5kZGF0YSA9IHtcbiAgICBwaHlzaWNzOiB7IGNvcnJlY3Q6IDAsIGluY29ycmVjdDogMCwgdW5hdHRlbXB0ZWQ6IDAgfSxcbiAgICBjaGVtaXN0cnk6IHsgY29ycmVjdDogMCwgaW5jb3JyZWN0OiAwLCB1bmF0dGVtcHRlZDogMCB9LFxuICAgIG1hdGhzOiB7IGNvcnJlY3Q6IDAsIGluY29ycmVjdDogMCwgdW5hdHRlbXB0ZWQ6IDAgfSxcbiAgfTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXJrcy5sZW5ndGg7IGkrKykge1xuICAgIHNlbmRkYXRhLnBoeXNpY3MuY29ycmVjdCArPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5QaHlzaWNzX0M7XG4gICAgc2VuZGRhdGEucGh5c2ljcy5pbmNvcnJlY3QgKz0gbWFya3NbaV0uY3d1QW5hbHlzaXMuUGh5c2ljc19XO1xuICAgIHNlbmRkYXRhLnBoeXNpY3MudW5hdHRlbXB0ZWQgKz0gbWFya3NbaV0uY3d1QW5hbHlzaXMuUGh5c2ljc19VO1xuICAgIHNlbmRkYXRhLmNoZW1pc3RyeS5jb3JyZWN0ICs9IG1hcmtzW2ldLmN3dUFuYWx5c2lzLkNoZW1pc3RyeV9DO1xuICAgIHNlbmRkYXRhLmNoZW1pc3RyeS5pbmNvcnJlY3QgKz0gbWFya3NbaV0uY3d1QW5hbHlzaXMuQ2hlbWlzdHJ5X1c7XG4gICAgc2VuZGRhdGEuY2hlbWlzdHJ5LnVuYXR0ZW1wdGVkICs9IG1hcmtzW2ldLmN3dUFuYWx5c2lzLkNoZW1pc3RyeV9VO1xuICAgIHNlbmRkYXRhLm1hdGhzLmNvcnJlY3QgKz0gbWFya3NbaV0uY3d1QW5hbHlzaXMuTWF0aHNfQztcbiAgICBzZW5kZGF0YS5tYXRocy5pbmNvcnJlY3QgKz0gbWFya3NbaV0uY3d1QW5hbHlzaXMuTWF0aHNfVztcbiAgICBzZW5kZGF0YS5tYXRocy51bmF0dGVtcHRlZCArPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5NYXRoc19VO1xuICB9XG4gIGNvbnN0IGZpbmFsRGF0YSA9IFt7IHZhbHVlOiAwLCBuYW1lOiAnJywgZ3JvdXA6ICcnIH1dO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEucGh5c2ljcy5jb3JyZWN0IC8gbWFya3MubGVuZ3RoKSxcbiAgICBuYW1lOiAnQ29ycmVjdCcsXG4gICAgZ3JvdXA6ICdQaHlzaWNzJyxcbiAgfSk7XG4gIGZpbmFsRGF0YS5wdXNoKHtcbiAgICB2YWx1ZTogTWF0aC5yb3VuZChzZW5kZGF0YS5waHlzaWNzLmluY29ycmVjdCAvIG1hcmtzLmxlbmd0aCksXG4gICAgbmFtZTogJ0luY29ycmVjdCcsXG4gICAgZ3JvdXA6ICdQaHlzaWNzJyxcbiAgfSk7XG4gIGZpbmFsRGF0YS5wdXNoKHtcbiAgICB2YWx1ZTogTWF0aC5yb3VuZChzZW5kZGF0YS5waHlzaWNzLnVuYXR0ZW1wdGVkIC8gbWFya3MubGVuZ3RoKSxcbiAgICBuYW1lOiAnVW5hdHRlbXB0ZWQnLFxuICAgIGdyb3VwOiAnUGh5c2ljcycsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEuY2hlbWlzdHJ5LmNvcnJlY3QgLyBtYXJrcy5sZW5ndGgpLFxuICAgIG5hbWU6ICdDb3JyZWN0JyxcbiAgICBncm91cDogJ0NoZW1pc3RyeScsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEuY2hlbWlzdHJ5LmluY29ycmVjdCAvIG1hcmtzLmxlbmd0aCksXG4gICAgbmFtZTogJ0luY29ycmVjdCcsXG4gICAgZ3JvdXA6ICdDaGVtaXN0cnknLFxuICB9KTtcbiAgZmluYWxEYXRhLnB1c2goe1xuICAgIHZhbHVlOiBNYXRoLnJvdW5kKHNlbmRkYXRhLmNoZW1pc3RyeS51bmF0dGVtcHRlZCAvIG1hcmtzLmxlbmd0aCksXG4gICAgbmFtZTogJ1VuYXR0ZW1wdGVkJyxcbiAgICBncm91cDogJ0NoZW1pc3RyeScsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEubWF0aHMuY29ycmVjdCAvIG1hcmtzLmxlbmd0aCksXG4gICAgbmFtZTogJ0NvcnJlY3QnLFxuICAgIGdyb3VwOiAnTWF0aHMnLFxuICB9KTtcbiAgZmluYWxEYXRhLnB1c2goe1xuICAgIHZhbHVlOiBNYXRoLnJvdW5kKHNlbmRkYXRhLm1hdGhzLmluY29ycmVjdCAvIG1hcmtzLmxlbmd0aCksXG4gICAgbmFtZTogJ0luY29ycmVjdCcsXG4gICAgZ3JvdXA6ICdNYXRocycsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEubWF0aHMudW5hdHRlbXB0ZWQgLyBtYXJrcy5sZW5ndGgpLFxuICAgIG5hbWU6ICdVbmF0dGVtcHRlZCcsXG4gICAgZ3JvdXA6ICdNYXRocycsXG4gIH0pO1xuICBmaW5hbERhdGEuc3BsaWNlKDAsIDEpO1xuICByZXR1cm4gZmluYWxEYXRhO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhbXB1c0RhdGEoY2FtcHVzTmFtZSwgbWFya3MpIHtcbiAgY29uc3Qgc2VuZGRhdGEgPSB7XG4gICAgcGh5c2ljczogeyBjb3JyZWN0OiAwLCBpbmNvcnJlY3Q6IDAsIHVuYXR0ZW1wdGVkOiAwIH0sXG4gICAgY2hlbWlzdHJ5OiB7IGNvcnJlY3Q6IDAsIGluY29ycmVjdDogMCwgdW5hdHRlbXB0ZWQ6IDAgfSxcbiAgICBtYXRoczogeyBjb3JyZWN0OiAwLCBpbmNvcnJlY3Q6IDAsIHVuYXR0ZW1wdGVkOiAwIH0sXG4gIH07XG4gIGxldCBjb3VudCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya3MubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobWFya3NbaV0uY2FtcHVzSWQgPT09IGNhbXB1c05hbWUpIHtcbiAgICAgIHNlbmRkYXRhLnBoeXNpY3MuY29ycmVjdCArPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5QaHlzaWNzX0M7XG4gICAgICBzZW5kZGF0YS5waHlzaWNzLmluY29ycmVjdCArPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5QaHlzaWNzX1c7XG4gICAgICBzZW5kZGF0YS5waHlzaWNzLnVuYXR0ZW1wdGVkICs9IG1hcmtzW2ldLmN3dUFuYWx5c2lzLlBoeXNpY3NfVTtcbiAgICAgIHNlbmRkYXRhLmNoZW1pc3RyeS5jb3JyZWN0ICs9IG1hcmtzW2ldLmN3dUFuYWx5c2lzLkNoZW1pc3RyeV9DO1xuICAgICAgc2VuZGRhdGEuY2hlbWlzdHJ5LmluY29ycmVjdCArPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5DaGVtaXN0cnlfVztcbiAgICAgIHNlbmRkYXRhLmNoZW1pc3RyeS51bmF0dGVtcHRlZCArPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5DaGVtaXN0cnlfVTtcbiAgICAgIHNlbmRkYXRhLm1hdGhzLmNvcnJlY3QgKz0gbWFya3NbaV0uY3d1QW5hbHlzaXMuTWF0aHNfQztcbiAgICAgIHNlbmRkYXRhLm1hdGhzLmluY29ycmVjdCArPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5NYXRoc19XO1xuICAgICAgc2VuZGRhdGEubWF0aHMudW5hdHRlbXB0ZWQgKz0gbWFya3NbaV0uY3d1QW5hbHlzaXMuTWF0aHNfVTtcbiAgICAgIGNvdW50Kys7XG4gICAgfVxuICB9XG4gIGNvbnN0IGZpbmFsRGF0YSA9IFt7IHZhbHVlOiAwLCBuYW1lOiAnJywgZ3JvdXA6ICcnIH1dO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEucGh5c2ljcy5jb3JyZWN0IC8gY291bnQpLFxuICAgIG5hbWU6ICdDb3JyZWN0JyxcbiAgICBncm91cDogJ1BoeXNpY3MnLFxuICB9KTtcbiAgZmluYWxEYXRhLnB1c2goe1xuICAgIHZhbHVlOiBNYXRoLnJvdW5kKHNlbmRkYXRhLnBoeXNpY3MuaW5jb3JyZWN0IC8gY291bnQpLFxuICAgIG5hbWU6ICdJbmNvcnJlY3QnLFxuICAgIGdyb3VwOiAnUGh5c2ljcycsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEucGh5c2ljcy51bmF0dGVtcHRlZCAvIGNvdW50KSxcbiAgICBuYW1lOiAnVW5hdHRlbXB0ZWQnLFxuICAgIGdyb3VwOiAnUGh5c2ljcycsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEuY2hlbWlzdHJ5LmNvcnJlY3QgLyBjb3VudCksXG4gICAgbmFtZTogJ0NvcnJlY3QnLFxuICAgIGdyb3VwOiAnQ2hlbWlzdHJ5JyxcbiAgfSk7XG4gIGZpbmFsRGF0YS5wdXNoKHtcbiAgICB2YWx1ZTogTWF0aC5yb3VuZChzZW5kZGF0YS5jaGVtaXN0cnkuaW5jb3JyZWN0IC8gY291bnQpLFxuICAgIG5hbWU6ICdJbmNvcnJlY3QnLFxuICAgIGdyb3VwOiAnQ2hlbWlzdHJ5JyxcbiAgfSk7XG4gIGZpbmFsRGF0YS5wdXNoKHtcbiAgICB2YWx1ZTogTWF0aC5yb3VuZChzZW5kZGF0YS5jaGVtaXN0cnkudW5hdHRlbXB0ZWQgLyBjb3VudCksXG4gICAgbmFtZTogJ1VuYXR0ZW1wdGVkJyxcbiAgICBncm91cDogJ0NoZW1pc3RyeScsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEubWF0aHMuY29ycmVjdCAvIGNvdW50KSxcbiAgICBuYW1lOiAnQ29ycmVjdCcsXG4gICAgZ3JvdXA6ICdNYXRocycsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEubWF0aHMuaW5jb3JyZWN0IC8gY291bnQpLFxuICAgIG5hbWU6ICdJbmNvcnJlY3QnLFxuICAgIGdyb3VwOiAnTWF0aHMnLFxuICB9KTtcbiAgZmluYWxEYXRhLnB1c2goe1xuICAgIHZhbHVlOiBNYXRoLnJvdW5kKHNlbmRkYXRhLm1hdGhzLnVuYXR0ZW1wdGVkIC8gY291bnQpLFxuICAgIG5hbWU6ICdVbmF0dGVtcHRlZCcsXG4gICAgZ3JvdXA6ICdNYXRocycsXG4gIH0pO1xuICBjb25zb2xlLmxvZyhjb3VudCk7XG4gIGZpbmFsRGF0YS5zcGxpY2UoMCwgMSk7XG4gIHJldHVybiBmaW5hbERhdGE7XG59XG5leHBvcnQgZnVuY3Rpb24gc2VjdGlvbkRhdGEoc2VjdGlvbk5hbWUsIGNhbXB1c05hbWUsIG1hcmtzKSB7XG4gIGNvbnN0IHNlbmRkYXRhID0ge1xuICAgIHBoeXNpY3M6IHsgY29ycmVjdDogMCwgaW5jb3JyZWN0OiAwLCB1bmF0dGVtcHRlZDogMCB9LFxuICAgIGNoZW1pc3RyeTogeyBjb3JyZWN0OiAwLCBpbmNvcnJlY3Q6IDAsIHVuYXR0ZW1wdGVkOiAwIH0sXG4gICAgbWF0aHM6IHsgY29ycmVjdDogMCwgaW5jb3JyZWN0OiAwLCB1bmF0dGVtcHRlZDogMCB9LFxuICB9O1xuICBsZXQgY291bnQgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKFxuICAgICAgbWFya3NbaV0uc2VjdGlvbklkID09PSBzZWN0aW9uTmFtZSAmJlxuICAgICAgbWFya3NbaV0uY2FtcHVzSWQgPT09IGNhbXB1c05hbWVcbiAgICApIHtcbiAgICAgIHNlbmRkYXRhLnBoeXNpY3MuY29ycmVjdCArPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5QaHlzaWNzX0M7XG4gICAgICBzZW5kZGF0YS5waHlzaWNzLmluY29ycmVjdCArPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5QaHlzaWNzX1c7XG4gICAgICBzZW5kZGF0YS5waHlzaWNzLnVuYXR0ZW1wdGVkICs9IG1hcmtzW2ldLmN3dUFuYWx5c2lzLlBoeXNpY3NfVTtcbiAgICAgIHNlbmRkYXRhLmNoZW1pc3RyeS5jb3JyZWN0ICs9IG1hcmtzW2ldLmN3dUFuYWx5c2lzLkNoZW1pc3RyeV9DO1xuICAgICAgc2VuZGRhdGEuY2hlbWlzdHJ5LmluY29ycmVjdCArPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5DaGVtaXN0cnlfVztcbiAgICAgIHNlbmRkYXRhLmNoZW1pc3RyeS51bmF0dGVtcHRlZCArPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5DaGVtaXN0cnlfVTtcbiAgICAgIHNlbmRkYXRhLm1hdGhzLmNvcnJlY3QgKz0gbWFya3NbaV0uY3d1QW5hbHlzaXMuTWF0aHNfQztcbiAgICAgIHNlbmRkYXRhLm1hdGhzLmluY29ycmVjdCArPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5NYXRoc19XO1xuICAgICAgc2VuZGRhdGEubWF0aHMudW5hdHRlbXB0ZWQgKz0gbWFya3NbaV0uY3d1QW5hbHlzaXMuTWF0aHNfVTtcbiAgICAgIGNvdW50Kys7XG4gICAgfVxuICB9XG4gIGNvbnN0IGZpbmFsRGF0YSA9IFt7IHZhbHVlOiAwLCBuYW1lOiAnJywgZ3JvdXA6ICcnIH1dO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEucGh5c2ljcy5jb3JyZWN0IC8gY291bnQpLFxuICAgIG5hbWU6ICdDb3JyZWN0JyxcbiAgICBncm91cDogJ1BoeXNpY3MnLFxuICB9KTtcbiAgZmluYWxEYXRhLnB1c2goe1xuICAgIHZhbHVlOiBNYXRoLnJvdW5kKHNlbmRkYXRhLnBoeXNpY3MuaW5jb3JyZWN0IC8gY291bnQpLFxuICAgIG5hbWU6ICdJbmNvcnJlY3QnLFxuICAgIGdyb3VwOiAnUGh5c2ljcycsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEucGh5c2ljcy51bmF0dGVtcHRlZCAvIGNvdW50KSxcbiAgICBuYW1lOiAnVW5hdHRlbXB0ZWQnLFxuICAgIGdyb3VwOiAnUGh5c2ljcycsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEuY2hlbWlzdHJ5LmNvcnJlY3QgLyBjb3VudCksXG4gICAgbmFtZTogJ0NvcnJlY3QnLFxuICAgIGdyb3VwOiAnQ2hlbWlzdHJ5JyxcbiAgfSk7XG4gIGZpbmFsRGF0YS5wdXNoKHtcbiAgICB2YWx1ZTogTWF0aC5yb3VuZChzZW5kZGF0YS5jaGVtaXN0cnkuaW5jb3JyZWN0IC8gY291bnQpLFxuICAgIG5hbWU6ICdJbmNvcnJlY3QnLFxuICAgIGdyb3VwOiAnQ2hlbWlzdHJ5JyxcbiAgfSk7XG4gIGZpbmFsRGF0YS5wdXNoKHtcbiAgICB2YWx1ZTogTWF0aC5yb3VuZChzZW5kZGF0YS5jaGVtaXN0cnkudW5hdHRlbXB0ZWQgLyBjb3VudCksXG4gICAgbmFtZTogJ1VuYXR0ZW1wdGVkJyxcbiAgICBncm91cDogJ0NoZW1pc3RyeScsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEubWF0aHMuY29ycmVjdCAvIGNvdW50KSxcbiAgICBuYW1lOiAnQ29ycmVjdCcsXG4gICAgZ3JvdXA6ICdNYXRocycsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEubWF0aHMuaW5jb3JyZWN0IC8gY291bnQpLFxuICAgIG5hbWU6ICdJbmNvcnJlY3QnLFxuICAgIGdyb3VwOiAnTWF0aHMnLFxuICB9KTtcbiAgZmluYWxEYXRhLnB1c2goe1xuICAgIHZhbHVlOiBNYXRoLnJvdW5kKHNlbmRkYXRhLm1hdGhzLnVuYXR0ZW1wdGVkIC8gY291bnQpLFxuICAgIG5hbWU6ICdVbmF0dGVtcHRlZCcsXG4gICAgZ3JvdXA6ICdNYXRocycsXG4gIH0pO1xuICBjb25zb2xlLmxvZyhjb3VudCk7XG4gIGZpbmFsRGF0YS5zcGxpY2UoMCwgMSk7XG4gIHJldHVybiBmaW5hbERhdGE7XG59XG5leHBvcnQgZnVuY3Rpb24gc3R1ZGVudERhdGEoc3R1ZGVudE5hbWUsIG1hcmtzKSB7XG4gIGNvbnN0IHNlbmRkYXRhID0ge1xuICAgIHBoeXNpY3M6IHsgY29ycmVjdDogMCwgaW5jb3JyZWN0OiAwLCB1bmF0dGVtcHRlZDogMCB9LFxuICAgIGNoZW1pc3RyeTogeyBjb3JyZWN0OiAwLCBpbmNvcnJlY3Q6IDAsIHVuYXR0ZW1wdGVkOiAwIH0sXG4gICAgbWF0aHM6IHsgY29ycmVjdDogMCwgaW5jb3JyZWN0OiAwLCB1bmF0dGVtcHRlZDogMCB9LFxuICB9O1xuICBjb25zdCBjb3VudCA9IDE7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya3MubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobWFya3NbaV0ubmFtZSA9PT0gc3R1ZGVudE5hbWUpIHtcbiAgICAgIHNlbmRkYXRhLnBoeXNpY3MuY29ycmVjdCA9IG1hcmtzW2ldLmN3dUFuYWx5c2lzLlBoeXNpY3NfQztcbiAgICAgIHNlbmRkYXRhLnBoeXNpY3MuaW5jb3JyZWN0ID0gbWFya3NbaV0uY3d1QW5hbHlzaXMuUGh5c2ljc19XO1xuICAgICAgc2VuZGRhdGEucGh5c2ljcy51bmF0dGVtcHRlZCA9IG1hcmtzW2ldLmN3dUFuYWx5c2lzLlBoeXNpY3NfVTtcbiAgICAgIHNlbmRkYXRhLmNoZW1pc3RyeS5jb3JyZWN0ID0gbWFya3NbaV0uY3d1QW5hbHlzaXMuQ2hlbWlzdHJ5X0M7XG4gICAgICBzZW5kZGF0YS5jaGVtaXN0cnkuaW5jb3JyZWN0ID0gbWFya3NbaV0uY3d1QW5hbHlzaXMuQ2hlbWlzdHJ5X1c7XG4gICAgICBzZW5kZGF0YS5jaGVtaXN0cnkudW5hdHRlbXB0ZWQgPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5DaGVtaXN0cnlfVTtcbiAgICAgIHNlbmRkYXRhLm1hdGhzLmNvcnJlY3QgPSBtYXJrc1tpXS5jd3VBbmFseXNpcy5NYXRoc19DO1xuICAgICAgc2VuZGRhdGEubWF0aHMuaW5jb3JyZWN0ID0gbWFya3NbaV0uY3d1QW5hbHlzaXMuTWF0aHNfVztcbiAgICAgIHNlbmRkYXRhLm1hdGhzLnVuYXR0ZW1wdGVkID0gbWFya3NbaV0uY3d1QW5hbHlzaXMuTWF0aHNfVTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBjb25zdCBmaW5hbERhdGEgPSBbeyB2YWx1ZTogMCwgbmFtZTogJycsIGdyb3VwOiAnJyB9XTtcbiAgZmluYWxEYXRhLnB1c2goe1xuICAgIHZhbHVlOiBNYXRoLnJvdW5kKHNlbmRkYXRhLnBoeXNpY3MuY29ycmVjdCAvIGNvdW50KSxcbiAgICBuYW1lOiAnQ29ycmVjdCcsXG4gICAgZ3JvdXA6ICdQaHlzaWNzJyxcbiAgfSk7XG4gIGZpbmFsRGF0YS5wdXNoKHtcbiAgICB2YWx1ZTogTWF0aC5yb3VuZChzZW5kZGF0YS5waHlzaWNzLmluY29ycmVjdCAvIGNvdW50KSxcbiAgICBuYW1lOiAnSW5jb3JyZWN0JyxcbiAgICBncm91cDogJ1BoeXNpY3MnLFxuICB9KTtcbiAgZmluYWxEYXRhLnB1c2goe1xuICAgIHZhbHVlOiBNYXRoLnJvdW5kKHNlbmRkYXRhLnBoeXNpY3MudW5hdHRlbXB0ZWQgLyBjb3VudCksXG4gICAgbmFtZTogJ1VuYXR0ZW1wdGVkJyxcbiAgICBncm91cDogJ1BoeXNpY3MnLFxuICB9KTtcbiAgZmluYWxEYXRhLnB1c2goe1xuICAgIHZhbHVlOiBNYXRoLnJvdW5kKHNlbmRkYXRhLmNoZW1pc3RyeS5jb3JyZWN0IC8gY291bnQpLFxuICAgIG5hbWU6ICdDb3JyZWN0JyxcbiAgICBncm91cDogJ0NoZW1pc3RyeScsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEuY2hlbWlzdHJ5LmluY29ycmVjdCAvIGNvdW50KSxcbiAgICBuYW1lOiAnSW5jb3JyZWN0JyxcbiAgICBncm91cDogJ0NoZW1pc3RyeScsXG4gIH0pO1xuICBmaW5hbERhdGEucHVzaCh7XG4gICAgdmFsdWU6IE1hdGgucm91bmQoc2VuZGRhdGEuY2hlbWlzdHJ5LnVuYXR0ZW1wdGVkIC8gY291bnQpLFxuICAgIG5hbWU6ICdVbmF0dGVtcHRlZCcsXG4gICAgZ3JvdXA6ICdDaGVtaXN0cnknLFxuICB9KTtcbiAgZmluYWxEYXRhLnB1c2goe1xuICAgIHZhbHVlOiBNYXRoLnJvdW5kKHNlbmRkYXRhLm1hdGhzLmNvcnJlY3QgLyBjb3VudCksXG4gICAgbmFtZTogJ0NvcnJlY3QnLFxuICAgIGdyb3VwOiAnTWF0aHMnLFxuICB9KTtcbiAgZmluYWxEYXRhLnB1c2goe1xuICAgIHZhbHVlOiBNYXRoLnJvdW5kKHNlbmRkYXRhLm1hdGhzLmluY29ycmVjdCAvIGNvdW50KSxcbiAgICBuYW1lOiAnSW5jb3JyZWN0JyxcbiAgICBncm91cDogJ01hdGhzJyxcbiAgfSk7XG4gIGZpbmFsRGF0YS5wdXNoKHtcbiAgICB2YWx1ZTogTWF0aC5yb3VuZChzZW5kZGF0YS5tYXRocy51bmF0dGVtcHRlZCAvIGNvdW50KSxcbiAgICBuYW1lOiAnVW5hdHRlbXB0ZWQnLFxuICAgIGdyb3VwOiAnTWF0aHMnLFxuICB9KTtcbiAgY29uc29sZS5sb2coY291bnQpO1xuICBmaW5hbERhdGEuc3BsaWNlKDAsIDEpO1xuICByZXR1cm4gZmluYWxEYXRhO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoRGF0YShyZXEsIHJlcywgbmV4dCkge1xuICBjb25zb2xlLmRpcihyZXEpO1xuICBNYXN0ZXJSZXN1bHQuZmluZCh7fSwgKGVyciwgbWFya3MpID0+IHtcbiAgICBjb25zdCBzZW5kZGF0YSA9IFtdO1xuICAgIGNvbnN0IGNhbXB1c2VzID0gW107XG4gICAgY29uc3Qgc2VjdGlvbnMgPSBbXTtcbiAgICBjb25zdCBmaW5hbFNlYyA9IFtdO1xuICAgIGNvbnN0IGRhdGEgPSBbXTtcbiAgICBjb25zdCBjbCA9IDA7XG5cbiAgICBjb25zdCBudW1TZWMgPSBbXTtcbiAgICBjb25zdCBmaW5hbCA9IFtdO1xuICAgIGNvbnN0IG51bWJlck9mU3R1ZGVudHMgPSBbXTtcbiAgICBsZXQgZmluYWxEYXRhO1xuICAgIGlmICghcmVxLnF1ZXJ5LmNhbXB1cykge1xuICAgICAgZmluYWxEYXRhID0gYWxsRGF0YShtYXJrcyk7XG4gICAgfSBlbHNlIGlmICghcmVxLnF1ZXJ5LnNlY3Rpb24pIHtcbiAgICAgIGNvbnN0IGNhbXB1cyA9IHJlcS5xdWVyeS5jYW1wdXM7XG4gICAgICBmaW5hbERhdGEgPSBjYW1wdXNEYXRhKGNhbXB1cywgbWFya3MpO1xuICAgIH0gZWxzZSBpZiAoIXJlcS5xdWVyeS5zdHVkZW50KSB7XG4gICAgICBjb25zdCBzZWN0aW9uTmFtZSA9IHJlcS5xdWVyeS5zZWN0aW9uO1xuICAgICAgY29uc3QgY2FtcHVzTmFtZSA9IHJlcS5xdWVyeS5jYW1wdXM7XG4gICAgICBmaW5hbERhdGEgPSBzZWN0aW9uRGF0YShzZWN0aW9uTmFtZSwgY2FtcHVzTmFtZSwgbWFya3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzdHVkZW50X25hbWUgPSByZXEucXVlcnkuc3R1ZGVudDtcbiAgICAgIGZpbmFsRGF0YSA9IHN0dWRlbnREYXRhKHN0dWRlbnRfbmFtZSwgbWFya3MpO1xuICAgIH1cbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChmaW5hbERhdGEpO1xuICAgIH1cbiAgfSk7XG59XG5leHBvcnQgZGVmYXVsdCB7XG4gIGZldGNoRGF0YSxcbiAgYWxsRGF0YSxcbiAgY2FtcHVzRGF0YSxcbiAgc2VjdGlvbkRhdGEsXG4gIHN0dWRlbnREYXRhLFxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBpL2dldERhdGEvZ2V0RGF0YS5jb250cm9sbGVyLmpzIiwiY29uc3QgY29udHJvbGxlciA9IHJlcXVpcmUoJy4vZ2V0RGF0YS5jb250cm9sbGVyJyk7XG5jb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xucm91dGVyLmdldCgnL2ZldGNoRGF0YScsIGNvbnRyb2xsZXIuZmV0Y2hEYXRhKTtcbm1vZHVsZS5leHBvcnRzID0gcm91dGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9hcGkvZ2V0RGF0YS9pbmRleC5qcyIsImltcG9ydCBNYXN0ZXJSZXN1bHQgZnJvbSAnLi4vbWFzdGVyUmVzdWx0L21hc3RlclJlc3VsdC5tb2RlbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkYXRhKHJlcSwgcmVzLCBuZXh0KSB7XG4gIE1hc3RlclJlc3VsdC5maW5kKHt9LCAoZXJyLCBtYXJrcykgPT4ge1xuICAgIGNvbnN0IHNlbmRkYXRhID0gW107XG4gICAgY29uc3Qgc3R1ZGVudHMgPSBbXTtcbiAgICBsZXQgc3R1Y291bnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBmbGFnc3R1ID0gMDtcbiAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgc3R1Y291bnQ7IHArKykge1xuICAgICAgICBpZiAobWFya3NbaV0ucm9sbE51bWJlciA9PSBzdHVkZW50c1twXSkge1xuICAgICAgICAgIGZsYWdzdHUgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZmxhZ3N0dSA9PSAxKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgc3R1ZGVudHNbc3R1Y291bnQrK10gPSBtYXJrc1tpXS5yb2xsTnVtYmVyO1xuICAgICAgc2VuZGRhdGEucHVzaCh7Y2FtcHVzX25hbWU6IG1hcmtzW2ldLmNhbXB1c0lkLCBzZWN0aW9uX25hbWU6bWFya3NbaV0uc2VjdGlvbklkLCBzdHVkZW50X25hbWU6IG1hcmtzW2ldLm5hbWUsIHN0dWRlbnRfcm9sbF9udW1iZXI6bWFya3NbaV0ucm9sbE51bWJlcn0pO1xuICAgIH1cbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhmaW5hbCk7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChzZW5kZGF0YSk7XG4gICAgfVxuICB9KTtcbn1cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGF0YSxcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2FwaS9ncmFwaERhdGEvZ3JhcGhEYXRhLmNvbnRyb2xsZXIuanMiLCJjb25zdCBjb250cm9sbGVyID0gcmVxdWlyZSgnLi9ncmFwaERhdGEuY29udHJvbGxlcicpO1xuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcblxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxucm91dGVyLmdldCgnL2RhdGEnLCBjb250cm9sbGVyLmRhdGEpO1xubW9kdWxlLmV4cG9ydHMgPSByb3V0ZXI7XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBpL2dyYXBoRGF0YS9pbmRleC5qcyIsIi8qKlxuICogQVBJXG4gKi9cblxuLy8gaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5jb25zdCBzdHVkZW50ID0gcmVxdWlyZSgnLi9zdHVkZW50Jyk7XG5jb25zdCBtYXN0ZXJSZXN1bHQgPSByZXF1aXJlKCcuL21hc3RlclJlc3VsdCcpO1xuY29uc3Qgb3ZlckFsbEF2ZXJhZ2UgPSByZXF1aXJlKCcuL292ZXJBbGxBdmVyYWdlJyk7XG5jb25zdCBmaWxlc0xpc3QgPSByZXF1aXJlKCcuL2ZpbGVzTGlzdCcpO1xuY29uc3Qgc2VjdGlvbkF2ZXJhZ2UgPSByZXF1aXJlKCcuL3NlY3Rpb25BdmVyYWdlJyk7XG5jb25zdCBjYW1wdXNUb3BwZXIgPSByZXF1aXJlKCcuL2NhbXB1c1RvcHBlcicpO1xuY29uc3QgZmV0Y2hEZXRhaWxzID0gcmVxdWlyZSgnLi9mZXRjaERldGFpbHMnKTtcbmNvbnN0IGdldERhdGEgPSByZXF1aXJlKCcuL2dldERhdGEnKTtcbmNvbnN0IERvd25sb2FkID0gcmVxdWlyZSgnLi9Eb3dubG9hZCcpO1xuY29uc3QgZ3JhcGhEYXRhID0gcmVxdWlyZSgnLi9ncmFwaERhdGEnKTtcblxuLy8gY29uc3Qgc2VjdGlvblRvcHBlciA9IHJlcXVpcmUoJy4vc2VjdGlvblRvcHBlcicpO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYXBwKSB7XG4gIC8vICBJbnNlcnQgQVBJIGJlbG93XG4gIC8vIHVzZSB0aGUgc2FtZSBuYW1pbmcgY29udmVudGlvblxuICBhcHAudXNlKCcvYXBpL3N0dWRlbnRzJywgc3R1ZGVudCk7XG4gIGFwcC51c2UoJy9hcGkvbWFzdGVyUmVzdWx0cycsIG1hc3RlclJlc3VsdCk7XG4gIGFwcC51c2UoJy9hcGkvZmlsZXNMaXN0JywgZmlsZXNMaXN0KTtcbiAgYXBwLnVzZSgnL2FwaS9vdmVyQWxsQXZlcmFnZXMnLCBvdmVyQWxsQXZlcmFnZSk7XG4gIGFwcC51c2UoJy9hcGkvc2VjdGlvbkF2ZXJhZ2VzJywgc2VjdGlvbkF2ZXJhZ2UpO1xuICBhcHAudXNlKCcvYXBpL2NhbXB1c1RvcHBlcnMnLCBjYW1wdXNUb3BwZXIpO1xuICBhcHAudXNlKCcvYXBpL2ZldGNoRGV0YWlscycsIGZldGNoRGV0YWlscyk7XG4gIGFwcC51c2UoJy9hcGkvZ2V0RGF0YScsIGdldERhdGEpO1xuICBhcHAudXNlKCcvYXBpL2Rvd25sb2FkJywgRG93bmxvYWQpO1xuICBhcHAudXNlKCcvYXBpL2dyYXBoRGF0YScsIGdyYXBoRGF0YSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2FwaS9pbmRleC5qcyIsIi8vIGltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG4vLyBpbXBvcnQgRmlsZXNMaXN0IGZyb20gJy4uL2ZpbGVzTGlzdC9maWxlc0xpc3QubW9kZWwnO1xuY29uc3QgbXVsdGVyID0gcmVxdWlyZSgnbXVsdGVyJyk7XG5jb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuXG5jb25zdCBjb250cm9sbGVyID0gcmVxdWlyZSgnLi9tYXN0ZXJSZXN1bHQuY29udHJvbGxlcicpO1xuXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuXG5jb25zdCBzdG9yYWdlID0gbXVsdGVyLmRpc2tTdG9yYWdlKHtcbiAgZGVzdGluYXRpb246ICcuL2ZpbGVzJyxcbiAgZmlsZW5hbWUocmVxLCBmaWxlLCBjYikge1xuICAgIGNiKG51bGwsIGAke25ldyBEYXRlKCl9LSR7ZmlsZS5vcmlnaW5hbG5hbWV9YCk7XG4gICAgLy8gbmFtZShmaWxlKTtcbiAgfSxcbiAgLy8gdmFyIFRoaW5nID0gbW9uZ29vc2UubW9kZWwoJ2ZpbGVzTGlzdCcsIHNjaGVtYSk7XG4gIC8vIHZhciBtID0gbmV3IFRoaW5nO1xuICAvLyBtLmZpbGVuYW1lID0gbmV3IERhdGUoKTtcbiAgLy8gbS5maWxldXBsb2FkZWQgPSBmaWxlLm9yaWdpbmFsbmFtZTtcbiAgLy8gbS5zYXZlKGNhbGxiYWNrKTtcbn0pO1xuXG5jb25zdCB1cGxvYWQgPSBtdWx0ZXIoeyBzdG9yYWdlIH0pO1xuXG4vLyByb3V0ZXIuZ2V0KCcvJywgY29udHJvbGxlci5pbmRleCk7XG5yb3V0ZXIucG9zdChcbiAgJy9wb3B1bGF0ZURiJyxcbiAgdXBsb2FkLmFycmF5KCdmaWxlcycsIDIpLFxuICBjb250cm9sbGVyLnJlYWRGaWxlcyxcbiAgY29udHJvbGxlci5jcmVhdGVNYXN0ZXJSZXN1bHRzLFxuICBjb250cm9sbGVyLmN3dUFuYWx5c2lzLFxuICBjb250cm9sbGVyLm1hcmtBbmFseXNpcyxcbiAgY29udHJvbGxlci5yYW5rQW5hbHlzaXMsXG4gIGNvbnRyb2xsZXIuY3JlYXRlRmlsZURldGFpbHMsXG4gIC8vIGNvbnRyb2xsZXIudG90YWwsXG4gIGNvbnRyb2xsZXIucG9wdWxhdGVEYixcbik7XG4vLyByb3V0ZXIuZ2V0KCcvbG9sJywgY29udHJvbGxlci5sb2wpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBpL21hc3RlclJlc3VsdC9pbmRleC5qcyIsIi8qKlxuICogVXNpbmcgUmFpbHMtbGlrZSBzdGFuZGFyZCBuYW1pbmcgY29udmVudGlvbiBmb3IgZW5kcG9pbnRzLlxuICogR0VUICAgICAvYXBpL3N0dWRlbnRzICAgICAgICAgICAgICAtPiAgaW5kZXhcbiAqIFBPU1QgICAgL2FwaS9zdHVkZW50cyAgICAgICAgICAgICAgLT4gIGNyZWF0ZVxuICogR0VUICAgICAvYXBpL3N0dWRlbnRzLzppZCAgICAgICAgICAtPiAgc2hvd1xuICogUFVUICAgICAvYXBpL3N0dWRlbnRzLzppZCAgICAgICAgICAtPiAgdXBzZXJ0XG4gKiBQQVRDSCAgIC9hcGkvc3R1ZGVudHMvOmlkICAgICAgICAgIC0+ICBwYXRjaFxuICogREVMRVRFICAvYXBpL3N0dWRlbnRzLzppZCAgICAgICAgICAtPiAgZGVzdHJveVxuICovXG5cbmltcG9ydCBNYXN0ZXJSZXN1bHQgZnJvbSAnLi9tYXN0ZXJSZXN1bHQubW9kZWwnO1xuaW1wb3J0IEZpbGVzTGlzdCBmcm9tICcuLy4uL2ZpbGVzTGlzdC9maWxlc0xpc3QubW9kZWwnO1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBjc3Zqc29uID0gcmVxdWlyZSgnY3N2anNvbicpO1xuLy8gR2V0cyBhIGxpc3Qgb2YgU3R1ZGVudHNcbmV4cG9ydCBmdW5jdGlvbiBpbmRleChyZXEsIHJlcykge1xuICBNYXN0ZXJSZXN1bHQuZmluZCh7fSwgKGVyciwgZG9jcykgPT4ge1xuICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKGRvY3MpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0UXVlc3Rpb25SZXNwb25zZShlcnJvckRhdGEpIHtcbiAgY29uc3QgcmVzcG9uc2UgPSB7fTtcbiAgLy8gbGV0IHRvdGFsTnVtYmVyUXVlc3Rpb24gPSAwO1xuXG4gIC8vIGZvciAoY29uc3Qga2V5IGluIGVycm9yX2RhdGEpIHtcbiAgLy8gICBpZihrZXkubWF0Y2goL15bUV1cXGQqL2cpKXtcbiAgLy8gICAgIHRvdGFsX25vX3F1ZXN0aW9uICs9IDFcbiAgLy8gICAgIHJlc3BvbnNlW2tleV0gPSBlcnJvcl9kYXRhW2tleV1cbiAgLy8gICB9XG4gIC8vIH1cblxuICBPYmplY3Qua2V5cyhlcnJvckRhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAoa2V5Lm1hdGNoKC9eW1FdXFxkKi9nKSkge1xuICAgICAgLy8gdG90YWxOdW1iZXJRdWVzdGlvbiArPSAxO1xuICAgICAgcmVzcG9uc2Vba2V5XSA9IGVycm9yRGF0YVtrZXldO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHJlc3BvbnNlO1xufVxuXG5mdW5jdGlvbiBnZXRRdWVzdGlvbldpc2VSZXNwb25zZU1hcmtzKGVycm9yRGF0YSwgUW1hcCkge1xuICBjb25zdCByZXNwb25zZSA9IHt9O1xuICAvLyBsZXQgdG90YWxOdW1iZXJRdWVzdGlvbiA9IDA7XG5cbiAgLy8gZm9yIChjb25zdCBrZXkgaW4gZXJyb3JfZGF0YSkge1xuICAvLyAgIGlmKGtleS5tYXRjaCgvXltRXVxcZCovZykpe1xuICAvLyAgICAgdG90YWxfbm9fcXVlc3Rpb24gKz0gMVxuICAvLyAgICAgcmVzcG9uc2Vba2V5XSA9IGVycm9yX2RhdGFba2V5XVxuICAvLyAgIH1cbiAgLy8gfVxuXG4gIE9iamVjdC5rZXlzKGVycm9yRGF0YSkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmIChrZXkubWF0Y2goL15bUV1cXGQqL2cpKSB7XG4gICAgICAvLyB0b3RhbE51bWJlclF1ZXN0aW9uICs9IDE7XG4gICAgICBjb25zdCB0bXBRbWFwID0gUW1hcFtrZXldO1xuICAgICAgcmVzcG9uc2Vba2V5XSA9IHRtcFFtYXBbZXJyb3JEYXRhW2tleV1dO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHJlc3BvbnNlO1xufVxuXG5mdW5jdGlvbiBnZXRTdHVkZW50KGVycm9yRGF0YSwgUW1hcCkge1xuICBjb25zdCByZXN1bHQgPSB7fTtcblxuICByZXN1bHQucm9sbE51bWJlciA9IGVycm9yRGF0YS5TVFVfSUQ7XG4gIHJlc3VsdC5uYW1lID0gZXJyb3JEYXRhLk5BTUVfT0ZfVEhFX1NUVURFTlQ7XG4gIHJlc3VsdC5jYW1wdXNJZCA9IGVycm9yRGF0YS5DQU1QVVNfSUQ7XG4gIHJlc3VsdC5zZWN0aW9uSWQgPSBlcnJvckRhdGEuU0VDVElPTl9JRDtcblxuICByZXN1bHQucXVlc3Rpb25SZXNwb25zZSA9IGdldFF1ZXN0aW9uUmVzcG9uc2UoZXJyb3JEYXRhKTtcbiAgcmVzdWx0LnF1ZXN0aW9uTWFya3MgPSBnZXRRdWVzdGlvbldpc2VSZXNwb25zZU1hcmtzKGVycm9yRGF0YSwgUW1hcCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGdldFFtYXAobWFya2luZ1NjaGVtYURhdGEpIHtcbiAgY29uc3QgUSA9IHt9O1xuXG4gIGZvciAobGV0IGwgPSAwOyBsIDwgbWFya2luZ1NjaGVtYURhdGEubGVuZ3RoOyBsICs9IDEpIHtcbiAgICBRW21hcmtpbmdTY2hlbWFEYXRhW2xdLlFzXSA9IHtcbiAgICAgIEM6IG1hcmtpbmdTY2hlbWFEYXRhW2xdLkMsXG4gICAgICBXOiBtYXJraW5nU2NoZW1hRGF0YVtsXS5VLFxuICAgICAgVTogbWFya2luZ1NjaGVtYURhdGFbbF0uVyxcbiAgICAgIEFERDogbWFya2luZ1NjaGVtYURhdGFbbF0uQURELFxuICAgICAgc3ViamVjdDogbWFya2luZ1NjaGVtYURhdGFbbF0uU1VCSkVDVCxcbiAgICAgIHRvcGljOiBtYXJraW5nU2NoZW1hRGF0YVtsXS5UT1BJQyxcbiAgICAgIC8vIHN1Yl90b3BpYzogbWFya2luZ1NjaGVtYURhdGFbbF0uU1VCLVRPUElDLFxuICAgICAgY29uY2VwdDogbWFya2luZ1NjaGVtYURhdGFbbF0uQ09OQ0VQVCxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIFE7XG59XG5cbmZ1bmN0aW9uIGdldFN1YmplY3RzKG1hcmtpbmdTY2hlbWFEYXRhKSB7XG4gIGNvbnN0IHN1YmplY3RzID0gW107XG5cbiAgZm9yIChsZXQgbCA9IDA7IGwgPCBtYXJraW5nU2NoZW1hRGF0YS5sZW5ndGg7IGwgKz0gMSkge1xuICAgIGlmICghKG1hcmtpbmdTY2hlbWFEYXRhW2xdLlNVQkpFQ1QgaW4gc3ViamVjdHMpKSB7XG4gICAgICBzdWJqZWN0cy5wdXNoKG1hcmtpbmdTY2hlbWFEYXRhW2xdLlNVQkpFQ1QpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHVTZXQgPSBuZXcgU2V0KHN1YmplY3RzKTtcbiAgY29uc3QgdW5pcXVlU3ViamVjdHMgPSBBcnJheS5mcm9tKHVTZXQpO1xuICByZXR1cm4gdW5pcXVlU3ViamVjdHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkRmlsZXMocmVxLCByZXMsIG5leHQpIHtcbiAgLy8gY29uc29sZS5sb2cocmVxLmZpbGVzKTtcbiAgY29uc3QgZXJyb3JSZXBvcnRmaWxlID0gcmVxLmZpbGVzWzBdO1xuICBjb25zdCBtYXJraW5nU2NoZW1hZmlsZSA9IHJlcS5maWxlc1sxXTsgLy8gZmlsZSBwYXNzZWQgZnJvbSBjbGllbnRcblxuICAvLyBjb25zdCBtZXRhID0gcmVxLmJvZHk7IC8vIGFsbCBvdGhlciB2YWx1ZXMgcGFzc2VkIGZyb20gdGhlIGNsaWVudCwgbGlrZSBuYW1lLCBldGMuLlxuXG4gIC8vIGNvbnNvbGUubG9nKFwiZmlsZXM6IFwiLCByZXEuZmlsZXNbMF0pO1xuXG4gIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgZGVsaW1pdGVyOiAnLCcsIC8vIG9wdGlvbmFsXG4gICAgcXVvdGU6ICdcIicsIC8vIG9wdGlvbmFsXG4gIH07XG5cbiAgY29uc3QgZXJyb3JSZXBvcnRGcyA9IGZzLnJlYWRGaWxlU3luYyhlcnJvclJlcG9ydGZpbGUucGF0aCwge1xuICAgIGVuY29kaW5nOiAndXRmOCcsXG4gIH0pO1xuICBjb25zdCBtYXJraW5nU2NoZW1hRnMgPSBmcy5yZWFkRmlsZVN5bmMobWFya2luZ1NjaGVtYWZpbGUucGF0aCwge1xuICAgIGVuY29kaW5nOiAndXRmOCcsXG4gIH0pO1xuXG4gIGNvbnN0IGVycm9yUmVwb3J0RGF0YSA9IGNzdmpzb24udG9PYmplY3QoZXJyb3JSZXBvcnRGcywgb3B0aW9ucyk7XG4gIGNvbnN0IG1hcmtpbmdTY2hlbWFEYXRhID0gY3N2anNvbi50b09iamVjdChtYXJraW5nU2NoZW1hRnMsIG9wdGlvbnMpO1xuXG4gIHJlcS5lcnJvclJlcG9ydERhdGEgPSBlcnJvclJlcG9ydERhdGE7XG4gIHJlcS5tYXJraW5nU2NoZW1hRGF0YSA9IG1hcmtpbmdTY2hlbWFEYXRhO1xuICByZXEuUW1hcCA9IGdldFFtYXAobWFya2luZ1NjaGVtYURhdGEpO1xuICByZXEuc3ViamVjdHMgPSBnZXRTdWJqZWN0cyhtYXJraW5nU2NoZW1hRGF0YSk7XG4gIG5leHQoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hc3RlclJlc3VsdHMocmVxLCByZXMsIG5leHQpIHtcbiAgY29uc3QgbWFzdGVyUmVzdWx0cyA9IFtdO1xuICBmb3IgKGxldCBsID0gcmVxLmVycm9yUmVwb3J0RGF0YS5sZW5ndGggLSAxOyBsID49IDA7IGwgLT0gMSkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICByZXN1bHQgPSBnZXRTdHVkZW50KHJlcS5lcnJvclJlcG9ydERhdGFbbF0sIHJlcS5RbWFwKTtcbiAgICByZXN1bHQuUW1hcCA9IHJlcS5RbWFwO1xuICAgIHJlc3VsdC50ZXN0TmFtZSA9IHJlcS5ib2R5LnRlc3RuYW1lO1xuICAgIC8vIHJlc3VsdC50ZXN0X25hbWUgPSByZXEucGFyYW1zLm5hbWU7XG4gICAgLy8gcmVzdWx0LmRhdGUgPSByZXEucGFyYW1zLmRhdGU7XG4gICAgLy8gcmVzdWx0LnRlc3RfdHlwZSA9IHJlcS5wYXJhbXMudHlwZTtcblxuICAgIC8vIHJlc3VsdC50ZXN0X2lkID0gZ2VuZXJhdGVfdGVzdF9pZChyZXEucGFyYW1zLm5hbWUsIHJlcS5wYXJhbXMuZGF0ZSwgcmVxLnBhcmFtcy50eXBlKTtcbiAgICAvLyBjb25zb2xlLmxvZygnc2VjdGlvbiBpZCcgKyByZXN1bHQuc2VjdGlvbklkKTtcbiAgICBtYXN0ZXJSZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgfVxuXG4gIHJlcS5tYXN0ZXJSZXN1bHRzID0gbWFzdGVyUmVzdWx0cztcbiAgbmV4dCgpO1xufVxuXG5mdW5jdGlvbiBnZXRDd3VBbmFseXNpcyhxdWVzdGlvblJlc3BvbnNlLCBRbWFwLCBzdWJqZWN0cykge1xuICBjb25zdCBjd3UgPSB7fTtcblxuICBPYmplY3Qua2V5cyhzdWJqZWN0cykuZm9yRWFjaChrZXkgPT4ge1xuICAgIGN3dVsnJy5jb25jYXQoc3ViamVjdHNba2V5XSwgJ19DJyldID0gMDtcbiAgICBjd3VbJycuY29uY2F0KHN1YmplY3RzW2tleV0sICdfVycpXSA9IDA7XG4gICAgY3d1WycnLmNvbmNhdChzdWJqZWN0c1trZXldLCAnX1UnKV0gPSAwO1xuICAgIGN3dVsnJy5jb25jYXQoc3ViamVjdHNba2V5XSwgJ19BREQnKV0gPSAwO1xuICB9KTtcblxuICBPYmplY3Qua2V5cyhRbWFwKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgY29uc3QgbWFwID0gUW1hcFtrZXldO1xuICAgIGlmIChxdWVzdGlvblJlc3BvbnNlW2tleV0gPT09ICdBREQnKSB7XG4gICAgICBjd3VbJycuY29uY2F0KG1hcC5zdWJqZWN0LCAnX0MnKV0gKz0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3d1WycnLmNvbmNhdChtYXAuc3ViamVjdCwgJ18nLCBxdWVzdGlvblJlc3BvbnNlW2tleV0pXSArPSAxO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGN3dTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGN3dUFuYWx5c2lzKHJlcSwgcmVzLCBuZXh0KSB7XG4gIGZvciAobGV0IGwgPSAwOyBsIDwgcmVxLm1hc3RlclJlc3VsdHMubGVuZ3RoOyBsICs9IDEpIHtcbiAgICByZXEubWFzdGVyUmVzdWx0c1tsXS5jd3VBbmFseXNpcyA9IGdldEN3dUFuYWx5c2lzKFxuICAgICAgcmVxLm1hc3RlclJlc3VsdHNbbF0ucXVlc3Rpb25SZXNwb25zZSxcbiAgICAgIHJlcS5RbWFwLFxuICAgICAgcmVxLnN1YmplY3RzLFxuICAgICk7XG4gIH1cblxuICBuZXh0KCk7XG59XG5cbmZ1bmN0aW9uIGdldFN1YmplY3RNYXJrKHF1ZXN0aW9uUmVzcG9uc2UsIFFtYXAsIHN1YmplY3ROYW1lKSB7XG4gIGNvbnN0IHN1YmplY3RNYXJrID0ge307XG5cbiAgbGV0IG9idGFpbmVkTWFya3MgPSAwO1xuICBsZXQgdG90YWxNYXJrcyA9IDA7XG5cbiAgT2JqZWN0LmtleXMoUW1hcCkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGNvbnN0IG1hcCA9IFFtYXBba2V5XTtcbiAgICBpZiAobWFwLnN1YmplY3QgPT09IHN1YmplY3ROYW1lKSB7XG4gICAgICBvYnRhaW5lZE1hcmtzICs9IHBhcnNlSW50KG1hcFtxdWVzdGlvblJlc3BvbnNlW2tleV1dLCAxMCk7XG4gICAgICB0b3RhbE1hcmtzICs9IHBhcnNlSW50KG1hcC5DLCAxMCk7XG4gICAgfVxuICB9KTtcblxuICBzdWJqZWN0TWFyay5vYnRhaW5lZE1hcmtzID0gb2J0YWluZWRNYXJrcztcbiAgc3ViamVjdE1hcmsudG90YWxNYXJrcyA9IHRvdGFsTWFya3M7XG5cbiAgLy8gY29uc29sZS5sb2coc3ViamVjdF9tYXJrKTtcblxuICByZXR1cm4gc3ViamVjdE1hcms7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXJrQW5hbHlzaXMocmVxLCByZXMsIG5leHQpIHtcbiAgZm9yIChsZXQgbCA9IDA7IGwgPCByZXEubWFzdGVyUmVzdWx0cy5sZW5ndGg7IGwgKz0gMSkge1xuICAgIGNvbnN0IG1hcmsgPSB7fTtcbiAgICBjb25zdCBvdmVyYWxsID0ge307XG4gICAgb3ZlcmFsbC5vYnRhaW5lZE1hcmtzID0gMDtcbiAgICBvdmVyYWxsLnRvdGFsTWFya3MgPSAwO1xuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCByZXEuc3ViamVjdHMubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgIGNvbnN0IHRtcCA9IGdldFN1YmplY3RNYXJrKFxuICAgICAgICByZXEubWFzdGVyUmVzdWx0c1tsXS5xdWVzdGlvblJlc3BvbnNlLFxuICAgICAgICByZXEubWFzdGVyUmVzdWx0c1tsXS5RbWFwLFxuICAgICAgICByZXEuc3ViamVjdHNbal0sXG4gICAgICApO1xuXG4gICAgICBtYXJrW3JlcS5zdWJqZWN0c1tqXV0gPSB0bXA7XG4gICAgICBvdmVyYWxsLm9idGFpbmVkTWFya3MgKz0gdG1wLm9idGFpbmVkTWFya3M7XG4gICAgICBvdmVyYWxsLnRvdGFsTWFya3MgKz0gdG1wLnRvdGFsTWFya3M7XG4gICAgfVxuXG4gICAgbWFyay5vdmVyYWxsID0gb3ZlcmFsbDtcbiAgICByZXEubWFzdGVyUmVzdWx0c1tsXS5tYXJrQW5hbHlzaXMgPSBtYXJrO1xuICB9XG5cbiAgbmV4dCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFua0FuYWx5c2lzKHJlcSwgcmVzLCBuZXh0KSB7XG4gIC8vICBGb3IgZWFjaCBzdWJqZWN0XG4gIGZvciAobGV0IGwgPSAwOyBsIDwgcmVxLnN1YmplY3RzLmxlbmd0aDsgbCArPSAxKSB7XG4gICAgLy8gcmVxLnN1YmplY3RzW2xdXG4gICAgcmVxLm1hc3RlclJlc3VsdHMuc29ydChcbiAgICAgIChhLCBiKSA9PlxuICAgICAgICBhLm1hcmtBbmFseXNpc1tyZXEuc3ViamVjdHNbbF1dLm9idGFpbmVkTWFya3MgLVxuICAgICAgICBiLm1hcmtBbmFseXNpc1tyZXEuc3ViamVjdHNbbF1dLm9idGFpbmVkTWFya3MsXG4gICAgKTtcbiAgICBsZXQgc2tpcCA9IDE7XG4gICAgbGV0IGxhc3RNYXJrID1cbiAgICAgIHJlcS5tYXN0ZXJSZXN1bHRzW3JlcS5tYXN0ZXJSZXN1bHRzLmxlbmd0aCAtIDFdLm1hcmtBbmFseXNpc1tcbiAgICAgICAgcmVxLnN1YmplY3RzW2xdXG4gICAgICBdLm9idGFpbmVkTWFya3M7XG5cbiAgICBpZiAoXG4gICAgICByZXEubWFzdGVyUmVzdWx0c1tyZXEubWFzdGVyUmVzdWx0cy5sZW5ndGggLSAxXS5yYW5rQW5hbHlzaXMgPT09IHVuZGVmaW5lZFxuICAgICkge1xuICAgICAgcmVxLm1hc3RlclJlc3VsdHNbcmVxLm1hc3RlclJlc3VsdHMubGVuZ3RoIC0gMV0ucmFua0FuYWx5c2lzID0ge307XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgcmVxLm1hc3RlclJlc3VsdHNbcmVxLm1hc3RlclJlc3VsdHMubGVuZ3RoIC0gMV0ucmFua0FuYWx5c2lzW1xuICAgICAgICByZXEuc3ViamVjdHNbbF1cbiAgICAgIF0gPT09IHVuZGVmaW5lZFxuICAgICkge1xuICAgICAgcmVxLm1hc3RlclJlc3VsdHNbcmVxLm1hc3RlclJlc3VsdHMubGVuZ3RoIC0gMV0ucmFua0FuYWx5c2lzW1xuICAgICAgICByZXEuc3ViamVjdHNbbF1cbiAgICAgIF0gPSB7fTtcbiAgICB9XG5cbiAgICByZXEubWFzdGVyUmVzdWx0c1tyZXEubWFzdGVyUmVzdWx0cy5sZW5ndGggLSAxXS5yYW5rQW5hbHlzaXNbXG4gICAgICByZXEuc3ViamVjdHNbbF1cbiAgICBdLnJhbmsgPSAxO1xuXG4gICAgbGV0IGxhc3RSYW5rID0gMTtcblxuICAgIGZvciAobGV0IGsgPSByZXEubWFzdGVyUmVzdWx0cy5sZW5ndGggLSAyOyBrID49IDA7IGsgLT0gMSkge1xuICAgICAgaWYgKHJlcS5tYXN0ZXJSZXN1bHRzW2tdLnJhbmtBbmFseXNpcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlcS5tYXN0ZXJSZXN1bHRzW2tdLnJhbmtBbmFseXNpcyA9IHt9O1xuICAgICAgfVxuICAgICAgaWYgKHJlcS5tYXN0ZXJSZXN1bHRzW2tdLnJhbmtBbmFseXNpc1tyZXEuc3ViamVjdHNbbF1dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmVxLm1hc3RlclJlc3VsdHNba10ucmFua0FuYWx5c2lzW3JlcS5zdWJqZWN0c1tsXV0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICByZXEubWFzdGVyUmVzdWx0c1trXS5tYXJrQW5hbHlzaXNbcmVxLnN1YmplY3RzW2xdXS5vYnRhaW5lZE1hcmtzID09PVxuICAgICAgICBsYXN0TWFya1xuICAgICAgKSB7XG4gICAgICAgIHJlcS5tYXN0ZXJSZXN1bHRzW2tdLnJhbmtBbmFseXNpc1tyZXEuc3ViamVjdHNbbF1dLnJhbmsgPSBsYXN0UmFuaztcbiAgICAgICAgc2tpcCArPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxLm1hc3RlclJlc3VsdHNba10ucmFua0FuYWx5c2lzW3JlcS5zdWJqZWN0c1tsXV0ucmFuayA9XG4gICAgICAgICAgbGFzdFJhbmsgKyBza2lwO1xuXG4gICAgICAgIGxhc3RNYXJrID1cbiAgICAgICAgICByZXEubWFzdGVyUmVzdWx0c1trXS5tYXJrQW5hbHlzaXNbcmVxLnN1YmplY3RzW2xdXS5vYnRhaW5lZE1hcmtzO1xuXG4gICAgICAgIGxhc3RSYW5rICs9IHNraXA7XG4gICAgICAgIHNraXAgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEZvciBPdmVybGwgbWFya1xuICByZXEubWFzdGVyUmVzdWx0cy5zb3J0KFxuICAgIChhLCBiKSA9PlxuICAgICAgYS5tYXJrQW5hbHlzaXMub3ZlcmFsbC5vYnRhaW5lZE1hcmtzIC1cbiAgICAgIGIubWFya0FuYWx5c2lzLm92ZXJhbGwub2J0YWluZWRNYXJrcyxcbiAgKTtcblxuICBsZXQgc2tpcCA9IDE7XG4gIGxldCBsYXN0TWFyayA9XG4gICAgcmVxLm1hc3RlclJlc3VsdHNbcmVxLm1hc3RlclJlc3VsdHMubGVuZ3RoIC0gMV0ubWFya0FuYWx5c2lzLm92ZXJhbGxcbiAgICAgIC5vYnRhaW5lZE1hcmtzO1xuXG4gIGlmIChcbiAgICByZXEubWFzdGVyUmVzdWx0c1tyZXEubWFzdGVyUmVzdWx0cy5sZW5ndGggLSAxXS5yYW5rQW5hbHlzaXMgPT09IHVuZGVmaW5lZFxuICApIHtcbiAgICByZXEubWFzdGVyUmVzdWx0c1tyZXEubWFzdGVyUmVzdWx0cy5sZW5ndGggLSAxXS5yYW5rQW5hbHlzaXMgPSB7fTtcbiAgfVxuXG4gIGlmIChcbiAgICByZXEubWFzdGVyUmVzdWx0c1tyZXEubWFzdGVyUmVzdWx0cy5sZW5ndGggLSAxXS5yYW5rQW5hbHlzaXMub3ZlcmFsbCA9PT1cbiAgICB1bmRlZmluZWRcbiAgKSB7XG4gICAgcmVxLm1hc3RlclJlc3VsdHNbcmVxLm1hc3RlclJlc3VsdHMubGVuZ3RoIC0gMV0ucmFua0FuYWx5c2lzLm92ZXJhbGwgPSB7fTtcbiAgfVxuXG4gIHJlcS5tYXN0ZXJSZXN1bHRzW3JlcS5tYXN0ZXJSZXN1bHRzLmxlbmd0aCAtIDFdLnJhbmtBbmFseXNpcy5vdmVyYWxsLnJhbmsgPSAxO1xuXG4gIGxldCBsYXN0UmFuayA9IDE7XG5cbiAgZm9yIChsZXQgayA9IHJlcS5tYXN0ZXJSZXN1bHRzLmxlbmd0aCAtIDI7IGsgPj0gMDsgayAtPSAxKSB7XG4gICAgaWYgKHJlcS5tYXN0ZXJSZXN1bHRzW2tdLnJhbmtBbmFseXNpcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXEubWFzdGVyUmVzdWx0c1trXS5yYW5rQW5hbHlzaXMgPSB7fTtcbiAgICB9XG4gICAgaWYgKHJlcS5tYXN0ZXJSZXN1bHRzW2tdLnJhbmtBbmFseXNpcy5vdmVyYWxsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlcS5tYXN0ZXJSZXN1bHRzW2tdLnJhbmtBbmFseXNpcy5vdmVyYWxsID0ge307XG4gICAgfVxuXG4gICAgaWYgKHJlcS5tYXN0ZXJSZXN1bHRzW2tdLm1hcmtBbmFseXNpcy5vdmVyYWxsLm9idGFpbmVkTWFya3MgPT09IGxhc3RNYXJrKSB7XG4gICAgICByZXEubWFzdGVyUmVzdWx0c1trXS5yYW5rQW5hbHlzaXMub3ZlcmFsbC5yYW5rID0gbGFzdFJhbms7XG4gICAgICBza2lwICs9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcS5tYXN0ZXJSZXN1bHRzW2tdLnJhbmtBbmFseXNpcy5vdmVyYWxsLnJhbmsgPSBsYXN0UmFuayArIHNraXA7XG5cbiAgICAgIGxhc3RNYXJrID0gcmVxLm1hc3RlclJlc3VsdHNba10ubWFya0FuYWx5c2lzLm92ZXJhbGwub2J0YWluZWRNYXJrcztcblxuICAgICAgbGFzdFJhbmsgKz0gc2tpcDtcbiAgICAgIHNraXAgPSAxO1xuICAgIH1cbiAgfVxuXG4gIC8vIExldCdzIGdvIHRvIHBvcHVsYXRlIGRiLlxuICBuZXh0KCk7XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRmlsZURldGFpbHMocmVxLCByZXMsIG5leHQpIHtcbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyArK2kpIHtcbiAgICBjb25zdCBjc3ZmaWxlID0ge307XG4gICAgY3N2ZmlsZS5maWxlbmFtZSA9IHJlcS5maWxlc1tpXS5vcmlnaW5hbG5hbWU7XG4gICAgY3N2ZmlsZS50ZXN0bmFtZSA9IHJlcS5ib2R5LnRlc3RuYW1lO1xuICAgIGNzdmZpbGUuZGF0ZXVwbG9hZGVkID0gbmV3IERhdGUoKTtcbiAgICBjc3ZmaWxlLmNoZWNrID0gdHJ1ZTtcbiAgICAvLyBhbGxmaWxlcy5wdXNoKGNzdmZpbGUpO1xuICAgIGFycmF5LnB1c2goY3N2ZmlsZSk7XG4gIH1cbiAgRmlsZXNMaXN0LmNyZWF0ZShhcnJheSwgZXJyID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfVxuICB9KTtcbiAgLy8gY29uc29sZS5sb2coYWxsZmlsZXMpO1xuXG4gIG5leHQoKTtcbn1cbi8vIGV4cG9ydCBmdW5jdGlvbiB0b3RhbChyZXEsIHJlcywgbmV4dCl7XG4vLyAgIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqKioqKlwiKTtcbi8vICAgY29uc29sZS5sb2cocmVxLm1hc3RlclJlc3VsdHNbMV0ubWFya0FuYWx5c2lzLm92ZXJhbGwub2J0YWluZWRNYXJrcyk7XG4vLyAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuLy8gICBuZXh0KCk7XG4vLyB9XG4vLyBGaW5hbGx5IHBvcHVsYXRlIHRvIGRiXG5leHBvcnQgZnVuY3Rpb24gcG9wdWxhdGVEYihyZXEsIHJlcykge1xuICBNYXN0ZXJSZXN1bHQuY3JlYXRlKHJlcS5tYXN0ZXJSZXN1bHRzLCAoZXJyLCBkb2NzKSA9PiB7XG4gICAgaWYgKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoZG9jcyk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICByZWFkRmlsZXMsXG4gIGNyZWF0ZU1hc3RlclJlc3VsdHMsXG4gIGNyZWF0ZUZpbGVEZXRhaWxzLFxuICBjd3VBbmFseXNpcyxcbiAgbWFya0FuYWx5c2lzLFxuICByYW5rQW5hbHlzaXMsXG4gIC8vIHRvdGFsLFxuICBwb3B1bGF0ZURiLFxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBpL21hc3RlclJlc3VsdC9tYXN0ZXJSZXN1bHQuY29udHJvbGxlci5qcyIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG4vLyBpbXBvcnQge3JlZ2lzdGVyRXZlbnRzfSBmcm9tICcuL3N0dWRlbnQuZXZlbnRzJztcblxuY29uc3QgTWFzdGVyUmVzdWx0U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XG4gIHJvbGxOdW1iZXI6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxuICBuYW1lOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgb21yU2hlZXRJZDogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IG51bGwgfSxcbiAgaW5zdGl0dXRlSWQ6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiBudWxsIH0sXG4gIGNhbXB1c0lkOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogbnVsbCB9LFxuICBzZWN0aW9uSWQ6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiBudWxsIH0sXG4gIGJhdGNoOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogbnVsbCB9LFxuICBjb3Vyc2VUeXBlOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogbnVsbCB9LFxuICBRbWFwOiB7fSxcbiAgcXVlc3Rpb25SZXNwb25zZToge30sXG4gIHF1ZXN0aW9uTWFya3M6IHt9LFxuICBjd3VBbmFseXNpczoge30sXG4gIG1hcmtBbmFseXNpczoge30sXG4gIHJhbmtBbmFseXNpczoge30sXG4gIGFjdGl2ZTogQm9vbGVhbixcbiAgdGVzdE5hbWU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxufSk7XG5cbi8vIHJlZ2lzdGVyRXZlbnRzKHN0dWRlbnRTY2hlbWEpO1xuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ01hc3RlclJlc3VsdCcsIE1hc3RlclJlc3VsdFNjaGVtYSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2FwaS9tYXN0ZXJSZXN1bHQvbWFzdGVyUmVzdWx0Lm1vZGVsLmpzIiwiY29uc3QgY29udHJvbGxlciA9IHJlcXVpcmUoJy4vb3ZlckFsbEF2ZXJhZ2UuY29udHJvbGxlcicpO1xuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcblxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbnJvdXRlci5nZXQoJy90b3RhbCcsIGNvbnRyb2xsZXIudG90YWwpO1xucm91dGVyLmdldCgnL2NhbXB1cycsIGNvbnRyb2xsZXIuY2FtcHVzKTtcbm1vZHVsZS5leHBvcnRzID0gcm91dGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9hcGkvb3ZlckFsbEF2ZXJhZ2UvaW5kZXguanMiLCJpbXBvcnQgTWFzdGVyUmVzdWx0IGZyb20gJy4uL21hc3RlclJlc3VsdC9tYXN0ZXJSZXN1bHQubW9kZWwnO1xuXG5jb25zdCBjc3ZmaWxlID0gcmVxdWlyZSgnY3N2LWZpbGUtY3JlYXRvcicpO1xuXG5leHBvcnQgZnVuY3Rpb24gdG90YWwocmVxLCByZXMsIG5leHQpIHtcbiAgTWFzdGVyUmVzdWx0LmZpbmQoe30sIChlcnIsIG1hcmtzKSA9PiB7XG4gICAgY29uc3QgYXZlcmFnZU1hcmtzID0geyB0b3RhbDogMCwgcGh5c2ljczogMCwgY2hlbWlzdHJ5OiAwLCBtYXRoczogMCB9O1xuICAgIGNvbnNvbGUubG9nKGF2ZXJhZ2VNYXJrcyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXJrcy5sZW5ndGg7IGkrKykge1xuICAgICAgYXZlcmFnZU1hcmtzLnRvdGFsICs9IG1hcmtzW2ldLm1hcmtBbmFseXNpcy5vdmVyYWxsLm9idGFpbmVkTWFya3M7XG4gICAgICBhdmVyYWdlTWFya3MubWF0aHMgKz0gbWFya3NbaV0ubWFya0FuYWx5c2lzLk1hdGhzLm9idGFpbmVkTWFya3M7XG4gICAgICBhdmVyYWdlTWFya3MuY2hlbWlzdHJ5ICs9IG1hcmtzW2ldLm1hcmtBbmFseXNpcy5DaGVtaXN0cnkub2J0YWluZWRNYXJrcztcbiAgICAgIGF2ZXJhZ2VNYXJrcy5waHlzaWNzICs9IG1hcmtzW2ldLm1hcmtBbmFseXNpcy5QaHlzaWNzLm9idGFpbmVkTWFya3M7XG4gICAgfVxuICAgIGF2ZXJhZ2VNYXJrcy50b3RhbCAvPSBtYXJrcy5sZW5ndGg7XG4gICAgYXZlcmFnZU1hcmtzLm1hdGhzIC89IG1hcmtzLmxlbmd0aDtcbiAgICBhdmVyYWdlTWFya3MucGh5c2ljcyAvPSBtYXJrcy5sZW5ndGg7XG4gICAgYXZlcmFnZU1hcmtzLmNoZW1pc3RyeSAvPSBtYXJrcy5sZW5ndGg7XG4gICAgY29uc3QgY3N2ZmlsZSA9IHJlcXVpcmUoJ2Nzdi1maWxlLWNyZWF0b3InKTtcbiAgICBjb25zdCB0ZXN0TmFtZXMgPSBbXTtcbiAgICBsZXQgdGVzdCA9IDA7XG4gICAgbGV0IHRmbGFnID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkhlbGxvXCIpO1xuICAgICAgdGZsYWcgPSAwO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0ZXN0OyBqKyspIHtcbiAgICAgICAgaWYgKG1hcmtzW2ldLnRlc3ROYW1lID09IHRlc3ROYW1lc1tqXSkge1xuICAgICAgICAgIHRmbGFnID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCF0ZmxhZykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIjJuZCBpZlwiKTtcbiAgICAgICAgdGVzdE5hbWVzW3Rlc3RdID0gbWFya3NbaV0udGVzdE5hbWU7XG4gICAgICAgIHRlc3QrKztcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3Rlc3QnICsgdGVzdCk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGVzdDsgaisrKSB7XG4gICAgICBjb25zdCBkYXRhID0gW1xuICAgICAgICBbXG4gICAgICAgICAgJ1RvdGFsIEF2ZXJhZ2UnLFxuICAgICAgICAgICdQaHlzaWNzIEF2ZXJhZ2UnLFxuICAgICAgICAgICdDaGVtaXN0cnkgQXZlcmFnZScsXG4gICAgICAgICAgJ01hdGhlbWF0aWNzIEF2ZXJhZ2UnLFxuICAgICAgICBdLFxuICAgICAgXTtcbiAgICAgIGRhdGFbMF0gPSBbXG4gICAgICAgICdUb3RhbCBBdmVyYWdlJyxcbiAgICAgICAgJ1BoeXNpY3MgQXZlcmFnZScsXG4gICAgICAgICdDaGVtaXN0cnkgQXZlcmFnZScsXG4gICAgICAgICdNYXRoZW1hdGljcyBBdmVyYWdlJyxcbiAgICAgIF07XG4gICAgICBkYXRhWzFdID0gW1xuICAgICAgICBNYXRoLnJvdW5kKGF2ZXJhZ2VNYXJrcy50b3RhbCksXG4gICAgICAgIE1hdGgucm91bmQoYXZlcmFnZU1hcmtzLnBoeXNpY3MpLFxuICAgICAgICBNYXRoLnJvdW5kKGF2ZXJhZ2VNYXJrcy5jaGVtaXN0cnkpLFxuICAgICAgICBNYXRoLnJvdW5kKGF2ZXJhZ2VNYXJrcy5tYXRocyksXG4gICAgICBdO1xuICAgICAgY29uc3QgbmFtZSA9IGAuL2NzdkZpbGVzLyR7dGVzdE5hbWVzW2pdfV9PdmVyYWxsX0F2ZXJhZ2UuY3N2YDtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGFbMV0pO1xuICAgICAgY3N2ZmlsZShuYW1lLCBkYXRhKTtcbiAgICB9XG4gICAgdmFyIGFyciA9IFtdO1xuICAgIGFyci5wdXNoKGF2ZXJhZ2VNYXJrcyk7XG4gICAgaWYgKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoYXJyKTtcbiAgICB9XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhbXB1cyhyZXEsIHJlcywgbmV4dCkge1xuICBNYXN0ZXJSZXN1bHQuZmluZCh7fSwgKGVyciwgbWFya3MpID0+IHtcbiAgICBjb25zdCBzZW5kZGF0YSA9IFtdO1xuICAgIGNvbnN0IGNhbXB1c2VzID0gW107XG4gICAgbGV0IGNsID0gMDtcbiAgICBjb25zdCBmaW5hbCA9IFtdO1xuICAgIGNvbnN0IG51bWJlck9mU3R1ZGVudHMgPSBbXTtcbiAgICBjb25zdCBjc3ZGaWxlID0gcmVxdWlyZSgnY3N2LWZpbGUtY3JlYXRvcicpO1xuICAgIGNvbnN0IHN0dWRlbnRzID0gW107XG4gICAgbGV0IHN0dWNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZmxhZ3N0dSA9IDA7XG4gICAgICBmb3IgKGxldCBwID0gMDsgcCA8IHN0dWNvdW50OyBwKyspIHtcbiAgICAgICAgaWYgKG1hcmtzW2ldLnJvbGxOdW1iZXIgPT0gc3R1ZGVudHNbcF0pIHtcbiAgICAgICAgICBmbGFnc3R1ID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZsYWdzdHUgPT0gMSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHN0dWRlbnRzW3N0dWNvdW50KytdID0gbWFya3NbaV0ucm9sbE51bWJlcjtcbiAgICAgIGxldCBmbGFnID0gMDtcbiAgICAgIGxldCBqID0gMDtcbiAgICAgIGZvciAoaiA9IDA7IGogPCBjbDsgaisrKSB7XG4gICAgICAgIGlmIChjYW1wdXNlc1tqXSA9PSBtYXJrc1tpXS5jYW1wdXNJZCkge1xuICAgICAgICAgIGZsYWcgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZmxhZyA9PSAxKSB7XG4gICAgICAgIG51bWJlck9mU3R1ZGVudHNbal0gKz0gMTtcbiAgICAgICAgc2VuZGRhdGFbal0udG90YWwgKz0gbWFya3NbaV0ubWFya0FuYWx5c2lzLm92ZXJhbGwub2J0YWluZWRNYXJrcztcbiAgICAgICAgc2VuZGRhdGFbal0ucGh5c2ljcyArPSBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuUGh5c2ljcy5vYnRhaW5lZE1hcmtzO1xuICAgICAgICBzZW5kZGF0YVtqXS5jaGVtaXN0cnkgKz0gbWFya3NbaV0ubWFya0FuYWx5c2lzLkNoZW1pc3RyeS5vYnRhaW5lZE1hcmtzO1xuICAgICAgICBzZW5kZGF0YVtqXS5tYXRocyArPSBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuTWF0aHMub2J0YWluZWRNYXJrcztcbiAgICAgICAgc2VuZGRhdGFbal0ubmFtZSA9IG1hcmtzW2ldLmNhbXB1c0lkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FtcHVzZXNbY2xdID0gbWFya3NbaV0uY2FtcHVzSWQ7XG4gICAgICAgIG51bWJlck9mU3R1ZGVudHNbal0gPSAxO1xuICAgICAgICBzZW5kZGF0YVtqXSA9IHsgdG90YWw6IDAsIHBoeXNpY3M6IDAsIGNoZW1pc3RyeTogMCwgbWF0aHM6IDAgfTtcbiAgICAgICAgY2wgKz0gMTtcbiAgICAgICAgc2VuZGRhdGFbal0udG90YWwgKz0gbWFya3NbaV0ubWFya0FuYWx5c2lzLm92ZXJhbGwub2J0YWluZWRNYXJrcztcbiAgICAgICAgc2VuZGRhdGFbal0ucGh5c2ljcyArPSBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuUGh5c2ljcy5vYnRhaW5lZE1hcmtzO1xuICAgICAgICBzZW5kZGF0YVtqXS5jaGVtaXN0cnkgKz0gbWFya3NbaV0ubWFya0FuYWx5c2lzLkNoZW1pc3RyeS5vYnRhaW5lZE1hcmtzO1xuICAgICAgICBzZW5kZGF0YVtqXS5tYXRocyArPSBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuTWF0aHMub2J0YWluZWRNYXJrcztcbiAgICAgICAgc2VuZGRhdGFbal0ubmFtZSA9IG1hcmtzW2ldLmNhbXB1c0lkO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2w7IGkrKykge1xuICAgICAgLy8gY29uc29sZS5sb2coc2VuZGRhdGFbaV0pO1xuICAgICAgLy8gY29uc29sZS5sb2cobnVtYmVyT2ZTdHVkZW50c1tpXSk7XG4gICAgICBmaW5hbFtpXSA9IHsgdG90YWw6IDAsIHBoeXNpY3M6IDAsIGNoZW1pc3RyeTogMCwgbWF0aHM6IDAsIGNhbXB1c19uYW1lOiAndGVzdCcgfTtcbiAgICAgIGZpbmFsW2ldLnRvdGFsID0gc2VuZGRhdGFbaV0udG90YWwgLyBudW1iZXJPZlN0dWRlbnRzW2ldO1xuICAgICAgZmluYWxbaV0ucGh5c2ljcyA9IHNlbmRkYXRhW2ldLnBoeXNpY3MgLyBudW1iZXJPZlN0dWRlbnRzW2ldO1xuICAgICAgZmluYWxbaV0uY2hlbWlzdHJ5ID0gc2VuZGRhdGFbaV0uY2hlbWlzdHJ5IC8gbnVtYmVyT2ZTdHVkZW50c1tpXTtcbiAgICAgIGZpbmFsW2ldLm1hdGhzID0gc2VuZGRhdGFbaV0ubWF0aHMgLyBudW1iZXJPZlN0dWRlbnRzW2ldO1xuICAgICAgZmluYWxbaV0uY2FtcHVzX25hbWUgPSBjYW1wdXNlc1tpXTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGZpbmFsW2ldKTtcbiAgICB9XG4gICAgY29uc3QgdGVzdE5hbWVzID0gW107XG4gICAgbGV0IHRlc3QgPSAwO1xuICAgIGxldCB0ZmxhZyA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXJrcy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gY29uc29sZS5sb2coXCJIZWxsb1wiKTtcbiAgICAgIHRmbGFnID0gMDtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGVzdDsgaisrKSB7XG4gICAgICAgIGlmIChtYXJrc1tpXS50ZXN0TmFtZSA9PSB0ZXN0TmFtZXNbal0pIHtcbiAgICAgICAgICB0ZmxhZyA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghdGZsYWcpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCIybmQgaWZcIik7XG4gICAgICAgIHRlc3ROYW1lc1t0ZXN0XSA9IG1hcmtzW2ldLnRlc3ROYW1lO1xuICAgICAgICB0ZXN0Kys7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0ZXN0JyArIHRlc3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKHRlc3ROYW1lc1swXSk7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0ZXN0OyBqKyspIHtcbiAgICAgIGNvbnN0IGRhdGEgPSBbXG4gICAgICAgIFtcbiAgICAgICAgICAnQ2FtcHVzIE5hbWUnLFxuICAgICAgICAgICdUb3RhbCBBdmVyYWdlJyxcbiAgICAgICAgICAnUGh5c2ljcyBBdmVyYWdlJyxcbiAgICAgICAgICAnQ2hlbWlzdHJ5IEF2ZXJhZ2UnLFxuICAgICAgICAgICdNYXRoZW1hdGljcyBBdmVyYWdlJyxcbiAgICAgICAgXSxcbiAgICAgIF07XG4gICAgICBkYXRhWzBdID0gW1xuICAgICAgICAnQ2FtcHVzIE5hbWUnLFxuICAgICAgICAnVG90YWwgQXZlcmFnZScsXG4gICAgICAgICdQaHlzaWNzIEF2ZXJhZ2UnLFxuICAgICAgICAnQ2hlbWlzdHJ5IEF2ZXJhZ2UnLFxuICAgICAgICAnTWF0aGVtYXRpY3MgQXZlcmFnZScsXG4gICAgICBdO1xuICAgICAgY29uc29sZS5sb2coJ0hlbGxvJyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsOyBpKyspIHtcbiAgICAgICAgZGF0YVtpICsgMV0gPSBbXG4gICAgICAgICAgY2FtcHVzZXNbaV0sXG4gICAgICAgICAgZmluYWxbaV0udG90YWwsXG4gICAgICAgICAgZmluYWxbaV0ucGh5c2ljcyxcbiAgICAgICAgICBmaW5hbFtpXS5jaGVtaXN0cnksXG4gICAgICAgICAgZmluYWxbaV0ubWF0aHMsXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgICBjb25zdCBuYW1lID0gYC4vY3N2RmlsZXMvJHt0ZXN0TmFtZXNbal19X0NhbXB1c19BdmVyYWdlLmNzdmA7XG4gICAgICBjc3ZGaWxlKG5hbWUsIGRhdGEpO1xuICAgIH1cbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChmaW5hbCk7XG4gICAgfVxuICB9KTtcbn1cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdG90YWwsXG4gIGNhbXB1cyxcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2FwaS9vdmVyQWxsQXZlcmFnZS9vdmVyQWxsQXZlcmFnZS5jb250cm9sbGVyLmpzIiwiY29uc3QgY29udHJvbGxlciA9IHJlcXVpcmUoJy4vc2VjdGlvbkF2ZXJhZ2UuY29udHJvbGxlcicpO1xuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcblxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbmNvbnN0IHNlY3Rpb24gPSByZXF1aXJlO1xucm91dGVyLmdldCgnL3NlY3Rpb24nLCBjb250cm9sbGVyLnNlY3Rpb24pO1xucm91dGVyLmdldCgnL3NlY3Rpb25Ub3BwZXJzJywgY29udHJvbGxlci5zZWN0aW9uVG9wcGVycyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBpL3NlY3Rpb25BdmVyYWdlL2luZGV4LmpzIiwiaW1wb3J0IE1hc3RlclJlc3VsdCBmcm9tICcuLi9tYXN0ZXJSZXN1bHQvbWFzdGVyUmVzdWx0Lm1vZGVsJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNlY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgTWFzdGVyUmVzdWx0LmZpbmQoe30sIChlcnIsIG1hcmtzKSA9PiB7XG4gICAgY29uc3Qgc2VuZGRhdGEgPSBbXTtcbiAgICBjb25zdCBjYW1wdXNlcyA9IFtdO1xuICAgIGNvbnN0IHNlY3Rpb25zID0gW107XG4gICAgY29uc3QgZmluYWxTZWMgPSBbXTtcbiAgICBsZXQgY2wgPSAwO1xuXG4gICAgY29uc3QgbnVtU2VjID0gW107XG4gICAgY29uc3QgZmluYWwgPSBbXTtcbiAgICBjb25zdCBudW1iZXJPZlN0dWRlbnRzID0gW107XG4gICAgY29uc3Qgc3R1ZGVudHMgPSBbXTtcbiAgICBsZXQgc3R1Y291bnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBmbGFnc3R1ID0gMDtcbiAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgc3R1Y291bnQ7IHArKykge1xuICAgICAgICBpZiAobWFya3NbaV0ucm9sbE51bWJlciA9PSBzdHVkZW50c1twXSkge1xuICAgICAgICAgIGZsYWdzdHUgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZmxhZ3N0dSA9PSAxKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgc3R1ZGVudHNbc3R1Y291bnQrK10gPSBtYXJrc1tpXS5yb2xsTnVtYmVyO1xuICAgICAgbGV0IGZsYWcgPSAwO1xuICAgICAgbGV0IGogPSAwO1xuXG4gICAgICBmb3IgKGogPSAwOyBqIDwgY2w7IGorKykge1xuICAgICAgICBpZiAoY2FtcHVzZXNbal0gPT0gbWFya3NbaV0uY2FtcHVzSWQpIHtcbiAgICAgICAgICBmbGFnID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZsYWcgPT0gMSkge1xuICAgICAgICBsZXQgZmxhZ1NlYyA9IDA7XG4gICAgICAgIGxldCBrID0gMDtcbiAgICAgICAgZm9yIChrID0gMDsgayA8IG51bVNlY1tqXTsgaysrKSB7XG4gICAgICAgICAgaWYgKG1hcmtzW2ldLnNlY3Rpb25JZCA9PSBzZW5kZGF0YVtqXS5zZWN0aW9uW2tdLnNlY05hbWUpIHtcbiAgICAgICAgICAgIHNlbmRkYXRhW2pdLnNlY3Rpb25ba10uc2VjVG90YWwgKz1cbiAgICAgICAgICAgICAgbWFya3NbaV0ubWFya0FuYWx5c2lzLm92ZXJhbGwub2J0YWluZWRNYXJrcztcbiAgICAgICAgICAgIHNlbmRkYXRhW2pdLnNlY3Rpb25ba10uc2VjUGh5c2ljcyArPVxuICAgICAgICAgICAgICBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuUGh5c2ljcy5vYnRhaW5lZE1hcmtzO1xuICAgICAgICAgICAgc2VuZGRhdGFbal0uc2VjdGlvbltrXS5zZWNDaGVtICs9XG4gICAgICAgICAgICAgIG1hcmtzW2ldLm1hcmtBbmFseXNpcy5DaGVtaXN0cnkub2J0YWluZWRNYXJrcztcbiAgICAgICAgICAgIHNlbmRkYXRhW2pdLnNlY3Rpb25ba10uc2VjTWF0aCArPVxuICAgICAgICAgICAgICBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuTWF0aHMub2J0YWluZWRNYXJrcztcbiAgICAgICAgICAgIHNlbmRkYXRhW2pdLmNhbXB1c05hbWUgPSBtYXJrc1tpXS5jYW1wdXNJZDtcbiAgICAgICAgICAgIHNlbmRkYXRhW2pdLnNlY3Rpb25ba10ubnVtYmVyT2ZTdHVkZW50cyArPSAxO1xuICAgICAgICAgICAgZmxhZ1NlYyA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmbGFnU2VjID09IDApIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaiA9ICcgKyBqKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnayA9ICcgKyBrKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzZW5kZGF0YVtqXSk7XG5cbiAgICAgICAgICBzZW5kZGF0YVtqXS5zZWN0aW9uW2tdLnNlY1RvdGFsICs9XG4gICAgICAgICAgICBtYXJrc1tpXS5tYXJrQW5hbHlzaXMub3ZlcmFsbC5vYnRhaW5lZE1hcmtzO1xuICAgICAgICAgIHNlbmRkYXRhW2pdLnNlY3Rpb25ba10uc2VjUGh5c2ljcyArPVxuICAgICAgICAgICAgbWFya3NbaV0ubWFya0FuYWx5c2lzLlBoeXNpY3Mub2J0YWluZWRNYXJrcztcbiAgICAgICAgICBzZW5kZGF0YVtqXS5zZWN0aW9uW2tdLnNlY0NoZW0gKz1cbiAgICAgICAgICAgIG1hcmtzW2ldLm1hcmtBbmFseXNpcy5DaGVtaXN0cnkub2J0YWluZWRNYXJrcztcbiAgICAgICAgICBzZW5kZGF0YVtqXS5zZWN0aW9uW2tdLnNlY01hdGggKz1cbiAgICAgICAgICAgIG1hcmtzW2ldLm1hcmtBbmFseXNpcy5NYXRocy5vYnRhaW5lZE1hcmtzO1xuICAgICAgICAgIC8vIHNlbmRkYXRhW2pdLmNhbXB1c05hbWUgPSBtYXJrc1tpXS5jYW1wdXNJZDtcbiAgICAgICAgICBzZW5kZGF0YVtqXS5zZWN0aW9uW2tdLm51bWJlck9mU3R1ZGVudHMgPSAxO1xuICAgICAgICAgIHNlbmRkYXRhW2pdLnNlY3Rpb25ba10uc2VjTmFtZSArPSBtYXJrc1tpXS5zZWN0aW9uSWQ7XG5cbiAgICAgICAgICBudW1TZWNbal0gKz0gMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FtcHVzZXNbY2xdID0gbWFya3NbaV0uY2FtcHVzSWQ7XG4gICAgICAgIHNlbmRkYXRhW2NsXSA9IHtcbiAgICAgICAgICBjYW1wdXNOYW1lOiAnJyxcbiAgICAgICAgICBzZWN0aW9uOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlY05hbWU6ICcnLFxuICAgICAgICAgICAgICBzZWNUb3RhbDogMCxcbiAgICAgICAgICAgICAgc2VjQ2hlbTogMCxcbiAgICAgICAgICAgICAgc2VjTWF0aDogMCxcbiAgICAgICAgICAgICAgc2VjUGh5c2ljczogMCxcbiAgICAgICAgICAgICAgbnVtYmVyT2ZTdHVkZW50czogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlY05hbWU6ICcnLFxuICAgICAgICAgICAgICBzZWNUb3RhbDogMCxcbiAgICAgICAgICAgICAgc2VjQ2hlbTogMCxcbiAgICAgICAgICAgICAgc2VjTWF0aDogMCxcbiAgICAgICAgICAgICAgc2VjUGh5c2ljczogMCxcbiAgICAgICAgICAgICAgbnVtYmVyT2ZTdHVkZW50czogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlY05hbWU6ICcnLFxuICAgICAgICAgICAgICBzZWNUb3RhbDogMCxcbiAgICAgICAgICAgICAgc2VjQ2hlbTogMCxcbiAgICAgICAgICAgICAgc2VjTWF0aDogMCxcbiAgICAgICAgICAgICAgc2VjUGh5c2ljczogMCxcbiAgICAgICAgICAgICAgbnVtYmVyT2ZTdHVkZW50czogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlY05hbWU6ICcnLFxuICAgICAgICAgICAgICBzZWNUb3RhbDogMCxcbiAgICAgICAgICAgICAgc2VjQ2hlbTogMCxcbiAgICAgICAgICAgICAgc2VjTWF0aDogMCxcbiAgICAgICAgICAgICAgc2VjUGh5c2ljczogMCxcbiAgICAgICAgICAgICAgbnVtYmVyT2ZTdHVkZW50czogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlY05hbWU6ICcnLFxuICAgICAgICAgICAgICBzZWNUb3RhbDogMCxcbiAgICAgICAgICAgICAgc2VjQ2hlbTogMCxcbiAgICAgICAgICAgICAgc2VjTWF0aDogMCxcbiAgICAgICAgICAgICAgc2VjUGh5c2ljczogMCxcbiAgICAgICAgICAgICAgbnVtYmVyT2ZTdHVkZW50czogMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfTtcbiAgICAgICAgY2wgKz0gMTtcbiAgICAgICAgLy8gc2VuZGRhdGFbY2wtMV1bMF0uc2VjdGlvbi5wdXNoKHtzZWNOYW1lOiBtYXJrc1tpXS5zZWN0aW9uSWQsIHNlY1RvdGFsOilcbiAgICAgICAgc2VuZGRhdGFbY2wgLSAxXS5zZWN0aW9uWzBdLnNlY05hbWUgPSBtYXJrc1tpXS5zZWN0aW9uSWQ7XG5cbiAgICAgICAgc2VuZGRhdGFbY2wgLSAxXS5zZWN0aW9uWzBdLnNlY1RvdGFsICs9XG4gICAgICAgICAgbWFya3NbaV0ubWFya0FuYWx5c2lzLm92ZXJhbGwub2J0YWluZWRNYXJrcztcbiAgICAgICAgc2VuZGRhdGFbY2wgLSAxXS5zZWN0aW9uWzBdLnNlY1BoeXNpY3MgKz1cbiAgICAgICAgICBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuUGh5c2ljcy5vYnRhaW5lZE1hcmtzO1xuICAgICAgICBzZW5kZGF0YVtjbCAtIDFdLnNlY3Rpb25bMF0uc2VjQ2hlbSArPVxuICAgICAgICAgIG1hcmtzW2ldLm1hcmtBbmFseXNpcy5DaGVtaXN0cnkub2J0YWluZWRNYXJrcztcbiAgICAgICAgc2VuZGRhdGFbY2wgLSAxXS5zZWN0aW9uWzBdLnNlY01hdGggKz1cbiAgICAgICAgICBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuTWF0aHMub2J0YWluZWRNYXJrcztcbiAgICAgICAgc2VuZGRhdGFbY2wgLSAxXS5jYW1wdXNOYW1lID0gbWFya3NbaV0uY2FtcHVzSWQ7XG5cbiAgICAgICAgLy8gIFx0c2VuZGRhdGFbY2wtMV1bMF0ubnVtYmVyT2ZTdHVkZW50cyA9IDE7XG4gICAgICAgIG51bVNlY1tjbCAtIDFdID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bVNlY1tpXTsgaisrKSB7XG4gICAgICAgIHNlbmRkYXRhW2ldLnNlY3Rpb25bal0uc2VjVG90YWwgLz1cbiAgICAgICAgICBzZW5kZGF0YVtpXS5zZWN0aW9uW2pdLm51bWJlck9mU3R1ZGVudHM7XG4gICAgICAgIHNlbmRkYXRhW2ldLnNlY3Rpb25bal0uc2VjUGh5c2ljcyAvPVxuICAgICAgICAgIHNlbmRkYXRhW2ldLnNlY3Rpb25bal0ubnVtYmVyT2ZTdHVkZW50cztcbiAgICAgICAgc2VuZGRhdGFbaV0uc2VjdGlvbltqXS5zZWNDaGVtIC89XG4gICAgICAgICAgc2VuZGRhdGFbaV0uc2VjdGlvbltqXS5udW1iZXJPZlN0dWRlbnRzO1xuICAgICAgICBzZW5kZGF0YVtpXS5zZWN0aW9uW2pdLnNlY01hdGggLz1cbiAgICAgICAgICBzZW5kZGF0YVtpXS5zZWN0aW9uW2pdLm51bWJlck9mU3R1ZGVudHM7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHRlc3ROYW1lcyA9IFtdO1xuICAgIGxldCB0ZXN0ID0gMDtcbiAgICBsZXQgdGZsYWcgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWFya3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiSGVsbG9cIik7XG4gICAgICB0ZmxhZyA9IDA7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRlc3Q7IGorKykge1xuICAgICAgICBpZiAobWFya3NbaV0udGVzdE5hbWUgPT0gdGVzdE5hbWVzW2pdKSB7XG4gICAgICAgICAgdGZsYWcgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXRmbGFnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiMm5kIGlmXCIpO1xuICAgICAgICB0ZXN0TmFtZXNbdGVzdF0gPSBtYXJrc1tpXS50ZXN0TmFtZTtcbiAgICAgICAgdGVzdCsrO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygndGVzdCcgKyB0ZXN0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgY3N2RmlsZSA9IHJlcXVpcmUoJ2Nzdi1maWxlLWNyZWF0b3InKTtcbiAgICB2YXIgZmluYWxEYXRhID0gW3tjYW1wdXNfbmFtZTogXCJcIixzZWN0aW9uX25hbWU6IFwiXCIsdG90YWw6IDAscGh5c2ljczogMCxjaGVtaXN0cnk6IDAsbWF0aHM6IDAsbnVtYmVyX29mX3N0dWRlbnRzOiAwfV07ICBcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IHRlc3Q7IGsrKykge1xuICAgICAgbGV0IGwgPSAxO1xuICAgICAgY29uc3QgZGF0YSA9IFtcbiAgICAgICAgW1xuICAgICAgICAgICdDYW1wdXMgTmFtZScsXG4gICAgICAgICAgJ1NlY3Rpb24gTmFtZScsXG4gICAgICAgICAgJ1RvdGFsIEF2ZXJhZ2UnLFxuICAgICAgICAgICdQaHlzaWNzIEF2ZXJhZ2UnLFxuICAgICAgICAgICdDaGVtaXN0cnkgQXZlcmFnZScsXG4gICAgICAgICAgJ01hdGhzIEF2ZXJhZ2UnLFxuICAgICAgICBdLFxuICAgICAgXTtcbiAgICAgIGRhdGFbMF0gPSBbXG4gICAgICAgICdDYW1wdXMgTmFtZScsXG4gICAgICAgICdTZWN0aW9uIE5hbWUnLFxuICAgICAgICAnVG90YWwgQXZlcmFnZScsXG4gICAgICAgICdQaHlzaWNzIEF2ZXJhZ2UnLFxuICAgICAgICAnQ2hlbWlzdHJ5IEF2ZXJhZ2UnLFxuICAgICAgICAnTWF0aHMgQXZlcmFnZScsXG4gICAgICBdO1xuICAgICAgXG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2w7IGkrKykge1xuICAgICAgICBmaW5hbFNlY1tpXSA9IHsgY2FtcHVzTmFtZTogJycsIHNlY3Rpb25EYXRhOiBbXSB9O1xuICAgICAgICAvLyBzZW5kZGF0YVtpXS5zZWN0aW9uLnNwbGljZSgwLCAxKTtcbiAgICAgICAgZmluYWxTZWNbaV0uY2FtcHVzTmFtZSA9IHNlbmRkYXRhW2ldLmNhbXB1c05hbWU7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtU2VjW2ldOyBqKyspIHtcbiAgICAgICAgICBmaW5hbFNlY1tpXS5zZWN0aW9uRGF0YS5wdXNoKHNlbmRkYXRhW2ldLnNlY3Rpb25bal0pO1xuICAgICAgICAgIC8vZmluYWxEYXRhLnB1c2goe2NhbXB1c19uYW1lOiBmaW5hbFNlY1tpXS5jYW1wdXNOYW1lLHNlY3Rpb25fbmFtZTogc2VuZGRhdGFbaV0uc2VjdGlvbltqXS5zZWNOYW1lLHRvdGFsOiBNYXRoLnJvdW5kKHNlbmRkYXRhW2ldLnNlY3Rpb25bal0uc2VjVG90YWwpLHBoeXNpY3M6IE1hdGgucm91bmQoc2VuZGRhdGFbaV0uc2VjdGlvbltqXS5zZWNQaHlzaWNzKSxjaGVtaXN0cnk6IE1hdGgucm91bmQoc2VuZGRhdGFbaV0uc2VjdGlvbltqXS5zZWNDaGVtKSxtYXRoczogTWF0aC5yb3VuZChzZW5kZGF0YVtpXS5zZWN0aW9uW2pdLnNlY01hdGgpLG51bWJlcl9vZl9zdHVkZW50czogc2VuZGRhdGFbaV0uc2VjdGlvbltqXS5udW1iZXJPZlN0dWRlbnRzfSk7XG4gICAgICAgICAgZGF0YVtsKytdID0gW1xuICAgICAgICAgICAgZmluYWxTZWNbaV0uY2FtcHVzTmFtZSxcbiAgICAgICAgICAgIHNlbmRkYXRhW2ldLnNlY3Rpb25bal0uc2VjTmFtZSxcbiAgICAgICAgICAgIE1hdGgucm91bmQoc2VuZGRhdGFbaV0uc2VjdGlvbltqXS5zZWNUb3RhbCksXG4gICAgICAgICAgICBNYXRoLnJvdW5kKHNlbmRkYXRhW2ldLnNlY3Rpb25bal0uc2VjUGh5c2ljcyksXG4gICAgICAgICAgICBNYXRoLnJvdW5kKHNlbmRkYXRhW2ldLnNlY3Rpb25bal0uc2VjQ2hlbSksXG4gICAgICAgICAgICBNYXRoLnJvdW5kKHNlbmRkYXRhW2ldLnNlY3Rpb25bal0uc2VjTWF0aCksXG4gICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgbmFtZSA9IGAuL2NzdkZpbGVzLyR7dGVzdE5hbWVzW2tdfV9TZWN0aW9uX0F2ZXJhZ2UuY3N2YDtcbiAgICAgIGNzdkZpbGUobmFtZSwgZGF0YSk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2w7IGkrKykgXG4gICAge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1TZWNbaV07IGorKykgXG4gICAgICB7XG4gICAgICAgICAgZmluYWxEYXRhLnB1c2goe2NhbXB1c19uYW1lOiBmaW5hbFNlY1tpXS5jYW1wdXNOYW1lLHNlY3Rpb25fbmFtZTogc2VuZGRhdGFbaV0uc2VjdGlvbltqXS5zZWNOYW1lLHRvdGFsOiBNYXRoLnJvdW5kKHNlbmRkYXRhW2ldLnNlY3Rpb25bal0uc2VjVG90YWwpLHBoeXNpY3M6IE1hdGgucm91bmQoc2VuZGRhdGFbaV0uc2VjdGlvbltqXS5zZWNQaHlzaWNzKSxjaGVtaXN0cnk6IE1hdGgucm91bmQoc2VuZGRhdGFbaV0uc2VjdGlvbltqXS5zZWNDaGVtKSxtYXRoczogTWF0aC5yb3VuZChzZW5kZGF0YVtpXS5zZWN0aW9uW2pdLnNlY01hdGgpLG51bWJlcl9vZl9zdHVkZW50czogc2VuZGRhdGFbaV0uc2VjdGlvbltqXS5udW1iZXJPZlN0dWRlbnRzfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZpbmFsRGF0YS5zcGxpY2UoMCwxKTtcbiAgICAvLyBjb25zb2xlLmxvZyhmaW5hbFNlY1sxXSArICdmaW5hbHNlYycpO1xuICAgIGlmIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKGZpbmFsRGF0YSk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlY3Rpb25Ub3BwZXJzKHJlcSwgcmVzLCBuZXh0KSB7XG4gIE1hc3RlclJlc3VsdC5maW5kKHt9LCAoZXJyLCBtYXJrcykgPT4ge1xuICAgIGNvbnN0IHNlbmRkYXRhID0gW107XG4gICAgY29uc3QgY2FtcHVzZXMgPSBbXTtcbiAgICBjb25zdCBzZWN0aW9ucyA9IFtdO1xuICAgIGNvbnN0IGZpbmFsU2VjID0gW107XG4gICAgbGV0IGNsID0gMDtcblxuICAgIGNvbnN0IG51bVNlYyA9IFtdO1xuICAgIGNvbnN0IGZpbmFsID0gW107XG4gICAgY29uc3QgbnVtYmVyT2ZTdHVkZW50cyA9IFtdO1xuICAgIGNvbnN0IHN0dWRlbnRzID0gW107XG4gICAgbGV0IHN0dWNvdW50ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZmxhZ3N0dSA9IDA7XG4gICAgICBmb3IgKGxldCBwID0gMDsgcCA8IHN0dWNvdW50OyBwKyspIHtcbiAgICAgICAgaWYgKG1hcmtzW2ldLnJvbGxOdW1iZXIgPT0gc3R1ZGVudHNbcF0pIHtcbiAgICAgICAgICBmbGFnc3R1ID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZsYWdzdHUgPT0gMSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHN0dWRlbnRzW3N0dWNvdW50KytdID0gbWFya3NbaV0ucm9sbE51bWJlcjtcbiAgICAgIGxldCBmbGFnID0gMDtcbiAgICAgIGxldCBqID0gMDtcblxuICAgICAgZm9yIChqID0gMDsgaiA8IGNsOyBqKyspIHtcbiAgICAgICAgaWYgKGNhbXB1c2VzW2pdID09IG1hcmtzW2ldLmNhbXB1c0lkKSB7XG4gICAgICAgICAgZmxhZyA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmbGFnID09IDEpIHtcbiAgICAgICAgbGV0IGZsYWdTZWMgPSAwO1xuICAgICAgICBsZXQgayA9IDA7XG4gICAgICAgIGZvciAoayA9IDA7IGsgPCBudW1TZWNbal07IGsrKykge1xuICAgICAgICAgIGlmIChtYXJrc1tpXS5zZWN0aW9uSWQgPT0gc2VuZGRhdGFbal0uc2VjdGlvbltrXS5zZWNOYW1lKSB7XG4gICAgICAgICAgICBzZW5kZGF0YVtqXS5zZWN0aW9uW2tdLnRvcHBlcnMucHVzaCh7XG4gICAgICAgICAgICAgIHN0dVRvdGFsOiBtYXJrc1tpXS5tYXJrQW5hbHlzaXMub3ZlcmFsbC5vYnRhaW5lZE1hcmtzLFxuICAgICAgICAgICAgICBzdHVDaGVtOiBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuQ2hlbWlzdHJ5Lm9idGFpbmVkTWFya3MsXG4gICAgICAgICAgICAgIHN0dU1hdGg6IG1hcmtzW2ldLm1hcmtBbmFseXNpcy5NYXRocy5vYnRhaW5lZE1hcmtzLFxuICAgICAgICAgICAgICBzdHVQaHlzaWNzOiBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuUGh5c2ljcy5vYnRhaW5lZE1hcmtzLFxuICAgICAgICAgICAgICBzdHVOYW1lOiBtYXJrc1tpXS5uYW1lLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZsYWdTZWMgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmxhZ1NlYyA9PSAwKSB7XG4gICAgICAgICAgc2VuZGRhdGFbal0uc2VjdGlvbltrXS50b3BwZXJzLnB1c2goe1xuICAgICAgICAgICAgc3R1VG90YWw6IG1hcmtzW2ldLm1hcmtBbmFseXNpcy5vdmVyYWxsLm9idGFpbmVkTWFya3MsXG4gICAgICAgICAgICBzdHVDaGVtOiBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuQ2hlbWlzdHJ5Lm9idGFpbmVkTWFya3MsXG4gICAgICAgICAgICBzdHVNYXRoOiBtYXJrc1tpXS5tYXJrQW5hbHlzaXMuTWF0aHMub2J0YWluZWRNYXJrcyxcbiAgICAgICAgICAgIHN0dVBoeXNpY3M6IG1hcmtzW2ldLm1hcmtBbmFseXNpcy5QaHlzaWNzLm9idGFpbmVkTWFya3MsXG4gICAgICAgICAgICBzdHVOYW1lOiBtYXJrc1tpXS5uYW1lLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgc2VuZGRhdGFbal0uc2VjdGlvbltrXS5zZWNOYW1lID0gbWFya3NbaV0uc2VjdGlvbklkO1xuXG4gICAgICAgICAgbnVtU2VjW2pdICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbXB1c2VzW2NsXSA9IG1hcmtzW2ldLmNhbXB1c0lkO1xuICAgICAgICBzZW5kZGF0YVtjbF0gPSB7XG4gICAgICAgICAgY2FtcHVzTmFtZTogJycsXG4gICAgICAgICAgc2VjdGlvbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzZWNOYW1lOiAnJyxcbiAgICAgICAgICAgICAgdG9wcGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHN0dVRvdGFsOiAwLFxuICAgICAgICAgICAgICAgICAgc3R1Q2hlbTogMCxcbiAgICAgICAgICAgICAgICAgIHN0dU1hdGg6IDAsXG4gICAgICAgICAgICAgICAgICBzdHVQaHlzaWNzOiAwLFxuICAgICAgICAgICAgICAgICAgc3R1TmFtZTogJycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlY05hbWU6ICcnLFxuICAgICAgICAgICAgICB0b3BwZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgc3R1VG90YWw6IDAsXG4gICAgICAgICAgICAgICAgICBzdHVDaGVtOiAwLFxuICAgICAgICAgICAgICAgICAgc3R1TWF0aDogMCxcbiAgICAgICAgICAgICAgICAgIHN0dVBoeXNpY3M6IDAsXG4gICAgICAgICAgICAgICAgICBzdHVOYW1lOiAnJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc2VjTmFtZTogJycsXG4gICAgICAgICAgICAgIHRvcHBlcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBzdHVUb3RhbDogMCxcbiAgICAgICAgICAgICAgICAgIHN0dUNoZW06IDAsXG4gICAgICAgICAgICAgICAgICBzdHVNYXRoOiAwLFxuICAgICAgICAgICAgICAgICAgc3R1UGh5c2ljczogMCxcbiAgICAgICAgICAgICAgICAgIHN0dU5hbWU6ICcnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzZWNOYW1lOiAnJyxcbiAgICAgICAgICAgICAgdG9wcGVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHN0dVRvdGFsOiAwLFxuICAgICAgICAgICAgICAgICAgc3R1Q2hlbTogMCxcbiAgICAgICAgICAgICAgICAgIHN0dU1hdGg6IDAsXG4gICAgICAgICAgICAgICAgICBzdHVQaHlzaWNzOiAwLFxuICAgICAgICAgICAgICAgICAgc3R1TmFtZTogJycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHNlY05hbWU6ICcnLFxuICAgICAgICAgICAgICB0b3BwZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgc3R1VG90YWw6IDAsXG4gICAgICAgICAgICAgICAgICBzdHVDaGVtOiAwLFxuICAgICAgICAgICAgICAgICAgc3R1TWF0aDogMCxcbiAgICAgICAgICAgICAgICAgIHN0dVBoeXNpY3M6IDAsXG4gICAgICAgICAgICAgICAgICBzdHVOYW1lOiAnJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9O1xuICAgICAgICBjbCArPSAxO1xuICAgICAgICBzZW5kZGF0YVtjbCAtIDFdLmNhbXB1c05hbWUgPSBtYXJrc1tpXS5jYW1wdXNJZDtcbiAgICAgICAgc2VuZGRhdGFbY2wgLSAxXS5zZWN0aW9uWzBdLnNlY05hbWUgPSBtYXJrcy5zZWN0aW9uSWQ7XG5cbiAgICAgICAgc2VuZGRhdGFbY2wgLSAxXS5zZWN0aW9uWzBdLnRvcHBlcnMucHVzaCh7XG4gICAgICAgICAgc3R1VG90YWw6IG1hcmtzW2ldLm1hcmtBbmFseXNpcy5vdmVyYWxsLm9idGFpbmVkTWFya3MsXG4gICAgICAgICAgc3R1Q2hlbTogbWFya3NbaV0ubWFya0FuYWx5c2lzLkNoZW1pc3RyeS5vYnRhaW5lZE1hcmtzLFxuICAgICAgICAgIHN0dU1hdGg6IG1hcmtzW2ldLm1hcmtBbmFseXNpcy5NYXRocy5vYnRhaW5lZE1hcmtzLFxuICAgICAgICAgIHN0dVBoeXNpY3M6IG1hcmtzW2ldLm1hcmtBbmFseXNpcy5QaHlzaWNzLm9idGFpbmVkTWFya3MsXG4gICAgICAgICAgc3R1TmFtZTogbWFya3NbaV0ubmFtZSxcbiAgICAgICAgfSk7XG4gICAgICAgIG51bVNlY1tjbCAtIDFdID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGZpbmFsRGF0YSA9IFt7Y2FtcHVzX25hbWU6IFwiXCIsc2VjdGlvbl9uYW1lOiBcIlwiLHN0dWRlbnRfbmFtZTogXCJcIixyYW5rOiAwLHBoeXNpY3M6IDAsY2hlbWlzdHJ5OiAwLG1hdGhzOiAwLHRvdGFsOiAwfV07ICBcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2w7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1TZWNbaV07IGorKykge1xuICAgICAgICBzZW5kZGF0YVtpXS5zZWN0aW9uW2pdLnRvcHBlcnMuc29ydCgoYSwgYikgPT4gYi5zdHVUb3RhbCAtIGEuc3R1VG90YWwpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsOyBpKyspIHtcbiAgICAgIGZpbmFsU2VjW2ldID0geyBjYW1wdXNOYW1lOiAnJyB9O1xuICAgICAgZmluYWxTZWNbaV0uY2FtcHVzTmFtZSA9IHNlbmRkYXRhW2ldLmNhbXB1c05hbWU7XG4gICAgICBjb25zdCBzZWN0aW9uRGF0YSA9IFtdO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1TZWNbaV07IGorKykge1xuICAgICAgICBzZWN0aW9uRGF0YVtqXSA9IFtdO1xuICAgICAgICBsZXQgcHRyID0gMDtcbiAgICAgICAgaWYgKHNlbmRkYXRhW2ldLnNlY3Rpb25bal0uc2VjTmFtZSkge1xuICAgICAgICAgIHB0cisrO1xuICAgICAgICAgIHNlY3Rpb25EYXRhW2pdLnB1c2goe1xuICAgICAgICAgICAgc2VjdGlvbk5hbWU6IHNlbmRkYXRhW2ldLnNlY3Rpb25bal0uc2VjTmFtZSxcbiAgICAgICAgICAgIHRvcHBlckRldGFpbHM6IFtdLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgNTsgaysrKSB7XG4gICAgICAgICAgICBzZWN0aW9uRGF0YVtqXVtwdHIgLSAxXS50b3BwZXJEZXRhaWxzLnB1c2goXG4gICAgICAgICAgICAgIHNlbmRkYXRhW2ldLnNlY3Rpb25bal0udG9wcGVyc1trXSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmaW5hbFNlY1tpXS5zZWN0aW9uRGF0YSA9IHNlY3Rpb25EYXRhO1xuICAgICAgZmluYWxTZWNbaV0uc2VjdGlvbkRhdGEuc3BsaWNlKDAsIDEpO1xuICAgIH1cbiAgICBjb25zdCB0ZXN0TmFtZXMgPSBbXTtcbiAgICBsZXQgdGVzdCA9IDA7XG4gICAgbGV0IHRmbGFnID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0ZmxhZyA9IDA7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRlc3Q7IGorKykge1xuICAgICAgICBpZiAobWFya3NbaV0udGVzdE5hbWUgPT0gdGVzdE5hbWVzW2pdKSB7XG4gICAgICAgICAgdGZsYWcgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXRmbGFnKSB7XG4gICAgICAgIHRlc3ROYW1lc1t0ZXN0XSA9IG1hcmtzW2ldLnRlc3ROYW1lO1xuICAgICAgICB0ZXN0Kys7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGNzdkZpbGUgPSByZXF1aXJlKCdjc3YtZmlsZS1jcmVhdG9yJyk7XG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCB0ZXN0OyBrKyspIHtcbiAgICAgIGxldCBsID0gMTtcbiAgICAgIGNvbnN0IGRhdGEgPSBbXG4gICAgICAgIFtcbiAgICAgICAgICAnQ2FtcHVzIE5hbWUnLFxuICAgICAgICAgICdTZWN0aW9uIE5hbWUnLFxuICAgICAgICAgICdTdHVkZW50IE5hbWUnLFxuICAgICAgICAgICdUb3RhbCcsXG4gICAgICAgICAgJ1BoeXNpY3MnLFxuICAgICAgICAgICdDaGVtaXN0cnknLFxuICAgICAgICAgICdNYXRocycsXG4gICAgICAgICAgJ1JhbmsnLFxuICAgICAgICBdLFxuICAgICAgXTtcbiAgICAgIGRhdGFbMF0gPSBbXG4gICAgICAgICdDYW1wdXMgTmFtZScsXG4gICAgICAgICdTZWN0aW9uIE5hbWUnLFxuICAgICAgICAnU3R1ZGVudCBOYW1lJyxcbiAgICAgICAgJ1RvdGFsJyxcbiAgICAgICAgJ1BoeXNpY3MnLFxuICAgICAgICAnQ2hlbWlzdHJ5JyxcbiAgICAgICAgJ01hdGhzJyxcbiAgICAgICAgJ1JhbmsnLFxuICAgICAgXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2w7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bVNlY1tpXSAtIDE7IGorKykge1xuICAgICAgICAgIGZvciAobGV0IG0gPSAwOyBtIDwgNTsgbSsrKSB7XG4gICAgICAgICAgICBkYXRhW2wrK10gPSBbXG4gICAgICAgICAgICAgIGZpbmFsU2VjW2ldLmNhbXB1c05hbWUsXG4gICAgICAgICAgICAgIGZpbmFsU2VjW2ldLnNlY3Rpb25EYXRhW2pdWzBdLnNlY3Rpb25OYW1lLFxuICAgICAgICAgICAgICBmaW5hbFNlY1tpXS5zZWN0aW9uRGF0YVtqXVswXS50b3BwZXJEZXRhaWxzW21dLnN0dU5hbWUsXG4gICAgICAgICAgICAgIGZpbmFsU2VjW2ldLnNlY3Rpb25EYXRhW2pdWzBdLnRvcHBlckRldGFpbHNbbV0uc3R1VG90YWwsXG4gICAgICAgICAgICAgIGZpbmFsU2VjW2ldLnNlY3Rpb25EYXRhW2pdWzBdLnRvcHBlckRldGFpbHNbbV0uc3R1UGh5c2ljcyxcbiAgICAgICAgICAgICAgZmluYWxTZWNbaV0uc2VjdGlvbkRhdGFbal1bMF0udG9wcGVyRGV0YWlsc1ttXS5zdHVDaGVtLFxuICAgICAgICAgICAgICBmaW5hbFNlY1tpXS5zZWN0aW9uRGF0YVtqXVswXS50b3BwZXJEZXRhaWxzW21dLnN0dU1hdGgsXG4gICAgICAgICAgICAgIG0gKyAxLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIGlmKGsgPT0gMClcbiAgICAgICAgICAgIGZpbmFsRGF0YS5wdXNoKHtjYW1wdXNfbmFtZTogZmluYWxTZWNbaV0uY2FtcHVzTmFtZSxzZWN0aW9uX25hbWU6IChmaW5hbFNlY1tpXS5zZWN0aW9uRGF0YVtqXVswXS5zZWN0aW9uTmFtZSksXG4gICAgICAgICAgICAgIHN0dWRlbnRfbmFtZTogKGZpbmFsU2VjW2ldLnNlY3Rpb25EYXRhW2pdWzBdLnRvcHBlckRldGFpbHNbbV0uc3R1TmFtZSkscmFuazogbSsxLHBoeXNpY3M6IE1hdGgucm91bmQoZmluYWxTZWNbaV0uc2VjdGlvbkRhdGFbal1bMF0udG9wcGVyRGV0YWlsc1ttXS5zdHVQaHlzaWNzKSxcbiAgICAgICAgICAgICAgY2hlbWlzdHJ5OiBNYXRoLnJvdW5kKGZpbmFsU2VjW2ldLnNlY3Rpb25EYXRhW2pdWzBdLnRvcHBlckRldGFpbHNbbV0uc3R1Q2hlbSksbWF0aHM6IE1hdGgucm91bmQoZmluYWxTZWNbaV0uc2VjdGlvbkRhdGFbal1bMF0udG9wcGVyRGV0YWlsc1ttXS5zdHVNYXRoKSx0b3RhbDogTWF0aC5yb3VuZChmaW5hbFNlY1tpXS5zZWN0aW9uRGF0YVtqXVswXS50b3BwZXJEZXRhaWxzW21dLnN0dVRvdGFsKX0pO1xuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBuYW1lID0gYC4vY3N2RmlsZXMvJHt0ZXN0TmFtZXNba119X1NlY3Rpb25fT3ZlcmFsbF9Ub3BwZXIuY3N2YDtcbiAgICAgIGNzdkZpbGUobmFtZSwgZGF0YSk7XG4gICAgfVxuICAgIGZpbmFsRGF0YS5zcGxpY2UoMCwxKTtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChmaW5hbERhdGEpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc2VjdGlvbixcbiAgc2VjdGlvblRvcHBlcnMsXG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9hcGkvc2VjdGlvbkF2ZXJhZ2Uvc2VjdGlvbkF2ZXJhZ2UuY29udHJvbGxlci5qcyIsImNvbnN0IG11bHRlciA9IHJlcXVpcmUoJ211bHRlcicpO1xuXG5jb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xuY29uc3QgY29udHJvbGxlciA9IHJlcXVpcmUoJy4vc3R1ZGVudC5jb250cm9sbGVyJyk7XG5cbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbmNvbnN0IHN0b3JhZ2UgPSBtdWx0ZXIuZGlza1N0b3JhZ2Uoe1xuICBkZXN0aW5hdGlvbjogJy4vZmlsZXMnLFxuICBmaWxlbmFtZShyZXEsIGZpbGUsIGNiKSB7XG4gICAgY2IobnVsbCwgYCR7bmV3IERhdGUoKX0tJHtmaWxlLm9yaWdpbmFsbmFtZX1gKTtcbiAgfSxcbn0pO1xuXG5jb25zdCB1cGxvYWQgPSBtdWx0ZXIoeyBzdG9yYWdlIH0pO1xuXG5yb3V0ZXIuZ2V0KCcvJywgY29udHJvbGxlci5pbmRleCk7XG5yb3V0ZXIucG9zdCgnL3BvcHVsYXRlRGInLCB1cGxvYWQuc2luZ2xlKCdmaWxlJyksIGNvbnRyb2xsZXIucG9wdWxhdGVEYik7XG4vLyByb3V0ZXIuZ2V0KCcvbG9sJywgY29udHJvbGxlci5sb2wpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBpL3N0dWRlbnQvaW5kZXguanMiLCIvKipcbiAqIFVzaW5nIFJhaWxzLWxpa2Ugc3RhbmRhcmQgbmFtaW5nIGNvbnZlbnRpb24gZm9yIGVuZHBvaW50cy5cbiAqIEdFVCAgICAgL2FwaS9zdHVkZW50cyAgICAgICAgICAgICAgLT4gIGluZGV4XG4gKiBQT1NUICAgIC9hcGkvc3R1ZGVudHMgICAgICAgICAgICAgIC0+ICBjcmVhdGVcbiAqIEdFVCAgICAgL2FwaS9zdHVkZW50cy86aWQgICAgICAgICAgLT4gIHNob3dcbiAqIFBVVCAgICAgL2FwaS9zdHVkZW50cy86aWQgICAgICAgICAgLT4gIHVwc2VydFxuICogUEFUQ0ggICAvYXBpL3N0dWRlbnRzLzppZCAgICAgICAgICAtPiAgcGF0Y2hcbiAqIERFTEVURSAgL2FwaS9zdHVkZW50cy86aWQgICAgICAgICAgLT4gIGRlc3Ryb3lcbiAqL1xuXG5pbXBvcnQgU3R1ZGVudCBmcm9tICcuL3N0dWRlbnQubW9kZWwnO1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBjc3Zqc29uID0gcmVxdWlyZSgnY3N2anNvbicpO1xuXG4vLyBHZXRzIGEgbGlzdCBvZiBTdHVkZW50c1xuZXhwb3J0IGZ1bmN0aW9uIGluZGV4KHJlcSwgcmVzKSB7XG4gIFN0dWRlbnQuZmluZCh7fSwgKGVyciwgZG9jcykgPT4ge1xuICAgIHJlcy5zZW5kKGRvY3MpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0dWRlbnQoc3R1ZGVudERhdGEpIHtcbiAgY29uc3Qgc3R1ZGVudCA9IHt9O1xuXG4gIHN0dWRlbnQucm9sbE51bWJlciA9IHN0dWRlbnREYXRhLnJvbGxOdW1iZXI7XG4gIHN0dWRlbnQubmFtZSA9IHN0dWRlbnREYXRhLm5hbWU7XG5cbiAgc3R1ZGVudC5hY2FkZW1pY0RldGFpbHMgPSB7XG4gICAgc2VjdGlvbklkOiBzdHVkZW50RGF0YS5zZWN0aW9uSWQsXG4gICAgY2FtcHVzSWQ6IHN0dWRlbnREYXRhLmNhbXB1c0lkLFxuICAgIGFkZG1pc3Npb25UeXBlOiBzdHVkZW50LmFkZG1pc3Npb25UeXBlLFxuICAgIGFkZG1pc3Npb25EYXRlOiBzdHVkZW50LmFkZG1pc3Npb25EYXRlLFxuICB9O1xuXG4gIHJldHVybiBzdHVkZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wdWxhdGVEYihyZXEsIHJlcykge1xuICBjb25zdCBmaWxlID0gcmVxLmZpbGU7IC8vIGZpbGUgcGFzc2VkIGZyb20gY2xpZW50XG4gIC8vIGNvbnN0IG1ldGEgPSByZXEuYm9keTsgLy8gYWxsIG90aGVyIHZhbHVlcyBwYXNzZWQgZnJvbSB0aGUgY2xpZW50LCBsaWtlIG5hbWUsIGV0Yy4uXG5cbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBkZWxpbWl0ZXI6ICcsJywgLy8gb3B0aW9uYWxcbiAgICBxdW90ZTogJ1wiJywgLy8gb3B0aW9uYWxcbiAgfTtcblxuICBjb25zdCBzdHVkZW50RnMgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZS5wYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG4gIGNvbnN0IHN0dWRlbnREYXRhID0gY3N2anNvbi50b09iamVjdChzdHVkZW50RnMsIG9wdGlvbnMpO1xuXG4gIGNvbnN0IHN0dWRlbnRzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudERhdGEubGVuZ3RoOyApIHtcbiAgICBjb25zdCB0bXAgPSBnZXRTdHVkZW50KHN0dWRlbnREYXRhW2ldKTtcbiAgICBzdHVkZW50cy5wdXNoKHRtcCk7XG4gICAgaSArPSAxO1xuICB9XG5cbiAgU3R1ZGVudC5jcmVhdGUoc3R1ZGVudHMsIChlcnIsIGRvY3MpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChkb2NzKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGluZGV4LCBwb3B1bGF0ZURiIH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2FwaS9zdHVkZW50L3N0dWRlbnQuY29udHJvbGxlci5qcyIsImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG4vLyBpbXBvcnQge3JlZ2lzdGVyRXZlbnRzfSBmcm9tICcuL3N0dWRlbnQuZXZlbnRzJztcblxuY29uc3QgU3R1ZGVudFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xuICByb2xsTnVtYmVyOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZSB9LFxuICBuYW1lOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgYWRkbWlzc2lvbk51bWJlcjogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IG51bGwgfSxcbiAgY291cnNlQ29kZTogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IG51bGwgfSxcbiAgZ2VuZGVyOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogbnVsbCB9LFxuICBkYXRlT2ZCaXJ0aDogeyB0eXBlOiBEYXRlLCBkZWZhdWx0OiBEYXRlLm5vdyB9LFxuICBhZGRtaXNzaW9uRGF0ZTogeyB0eXBlOiBEYXRlLCBkZWZhdWx0OiBEYXRlLm5vdyB9LFxuICBlbWFpbEFkZHJlc3M6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiAnc3R1ZGVudEBleGFtcGxlLmNvbScgfSxcbiAgY29udGFjdE51bWJlcjogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IG51bGwgfSxcbiAgYWNhZGVtaWNEZXRhaWxzOiBBcnJheSxcbiAgYWN0aXZlOiBCb29sZWFuLFxufSk7XG5cbi8vIHJlZ2lzdGVyRXZlbnRzKHN0dWRlbnRTY2hlbWEpO1xuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoJ1N0dWRlbnQnLCBTdHVkZW50U2NoZW1hKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBpL3N0dWRlbnQvc3R1ZGVudC5tb2RlbC5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmNvbnN0IENvbnRleHRUeXBlID0ge1xuICAvLyBFbmFibGVzIGNyaXRpY2FsIHBhdGggQ1NTIHJlbmRlcmluZ1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20va3JpYXNvZnQvaXNvbW9ycGhpYy1zdHlsZS1sb2FkZXJcbiAgaW5zZXJ0Q3NzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAvLyBVbml2ZXJzYWwgSFRUUCBjbGllbnRcbiAgZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG59O1xuXG4vKipcbiAqIFRoZSB0b3AtbGV2ZWwgUmVhY3QgY29tcG9uZW50IHNldHRpbmcgY29udGV4dCAoZ2xvYmFsKSB2YXJpYWJsZXNcbiAqIHRoYXQgY2FuIGJlIGFjY2Vzc2VkIGZyb20gYWxsIHRoZSBjaGlsZCBjb21wb25lbnRzLlxuICpcbiAqIGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvY29udGV4dC5odG1sXG4gKlxuICogVXNhZ2UgZXhhbXBsZTpcbiAqXG4gKiAgIGNvbnN0IGNvbnRleHQgPSB7XG4gKiAgICAgaGlzdG9yeTogY3JlYXRlQnJvd3Nlckhpc3RvcnkoKSxcbiAqICAgICBzdG9yZTogY3JlYXRlU3RvcmUoKSxcbiAqICAgfTtcbiAqXG4gKiAgIFJlYWN0RE9NLnJlbmRlcihcbiAqICAgICA8QXBwIGNvbnRleHQ9e2NvbnRleHR9PlxuICogICAgICAgPExheW91dD5cbiAqICAgICAgICAgPExhbmRpbmdQYWdlIC8+XG4gKiAgICAgICA8L0xheW91dD5cbiAqICAgICA8L0FwcD4sXG4gKiAgICAgY29udGFpbmVyLFxuICogICApO1xuICovXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb250ZXh0OiBQcm9wVHlwZXMuc2hhcGUoQ29udGV4dFR5cGUpLmlzUmVxdWlyZWQsXG4gICAgY2hpbGRyZW46IFByb3BUeXBlcy5lbGVtZW50LmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgc3RhdGljIGNoaWxkQ29udGV4dFR5cGVzID0gQ29udGV4dFR5cGU7XG5cbiAgZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmNvbnRleHQ7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLy8gTk9URTogSWYgeW91IG5lZWQgdG8gYWRkIG9yIG1vZGlmeSBoZWFkZXIsIGZvb3RlciBldGMuIG9mIHRoZSBhcHAsXG4gICAgLy8gcGxlYXNlIGRvIHRoYXQgaW5zaWRlIHRoZSBMYXlvdXQgY29tcG9uZW50LlxuICAgIHJldHVybiBSZWFjdC5DaGlsZHJlbi5vbmx5KHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY29tcG9uZW50cy9BcHAuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS3JpYXNvZnRpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzZXJpYWxpemUgZnJvbSAnc2VyaWFsaXplLWphdmFzY3JpcHQnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcnO1xuLy8gaW1wb3J0IGxpZ2h0QmFzZVRoZW1lIGZyb20gJ21hdGVyaWFsLXVpL3N0eWxlcy9iYXNlVGhlbWVzL2xpZ2h0QmFzZVRoZW1lJztcbi8vIGltcG9ydCBNdWlUaGVtZVByb3ZpZGVyIGZyb20gJ21hdGVyaWFsLXVpL3N0eWxlcy9NdWlUaGVtZVByb3ZpZGVyJztcbi8vIGltcG9ydCBnZXRNdWlUaGVtZSBmcm9tICdtYXRlcmlhbC11aS9zdHlsZXMvZ2V0TXVpVGhlbWUnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSByZWFjdC9uby1kYW5nZXIgKi9cblxuY2xhc3MgSHRtbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBkZXNjcmlwdGlvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHN0eWxlczogUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBjc3NUZXh0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICB9KS5pc1JlcXVpcmVkLFxuICAgICksXG4gICAgc2NyaXB0czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkKSxcbiAgICBhcHA6IFByb3BUeXBlcy5vYmplY3QsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICB9O1xuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgc3R5bGVzOiBbXSxcbiAgICBzY3JpcHRzOiBbXSxcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB0aXRsZSwgZGVzY3JpcHRpb24sIHN0eWxlcywgc2NyaXB0cywgYXBwLCBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGh0bWwgY2xhc3NOYW1lPVwibm8tanNcIiBsYW5nPVwiZW5cIj5cbiAgICAgICAgPGhlYWQ+XG4gICAgICAgICAgPG1ldGEgY2hhclNldD1cInV0Zi04XCIgLz5cbiAgICAgICAgICA8bWV0YSBodHRwRXF1aXY9XCJ4LXVhLWNvbXBhdGlibGVcIiBjb250ZW50PVwiaWU9ZWRnZVwiIC8+XG4gICAgICAgICAgPHRpdGxlPnt0aXRsZX08L3RpdGxlPlxuICAgICAgICAgIDxtZXRhIG5hbWU9XCJkZXNjcmlwdGlvblwiIGNvbnRlbnQ9e2Rlc2NyaXB0aW9ufSAvPlxuICAgICAgICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MVwiIC8+XG4gICAgICAgICAge3NjcmlwdHMubWFwKHNjcmlwdCA9PiAoXG4gICAgICAgICAgICA8bGluayBrZXk9e3NjcmlwdH0gcmVsPVwicHJlbG9hZFwiIGhyZWY9e3NjcmlwdH0gYXM9XCJzY3JpcHRcIiAvPlxuICAgICAgICAgICkpfVxuICAgICAgICAgIDxsaW5rIHJlbD1cImFwcGxlLXRvdWNoLWljb25cIiBocmVmPVwiYXBwbGUtdG91Y2gtaWNvbi5wbmdcIiAvPlxuICAgICAgICAgIHtzdHlsZXMubWFwKHN0eWxlID0+IChcbiAgICAgICAgICAgIDxzdHlsZVxuICAgICAgICAgICAgICBrZXk9e3N0eWxlLmlkfVxuICAgICAgICAgICAgICBpZD17c3R5bGUuaWR9XG4gICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogc3R5bGUuY3NzVGV4dCB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9oZWFkPlxuICAgICAgICA8Ym9keT5cbiAgICAgICAgICA8ZGl2IGlkPVwiYXBwXCIgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBjaGlsZHJlbiB9fSAvPlxuICAgICAgICAgIDxzY3JpcHRcbiAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogYHdpbmRvdy5BcHA9JHtzZXJpYWxpemUoYXBwKX1gIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7c2NyaXB0cy5tYXAoc2NyaXB0ID0+IDxzY3JpcHQga2V5PXtzY3JpcHR9IHNyYz17c2NyaXB0fSAvPil9XG4gICAgICAgICAge2NvbmZpZy5hbmFseXRpY3MuZ29vZ2xlVHJhY2tpbmdJZCAmJiAoXG4gICAgICAgICAgICA8c2NyaXB0XG4gICAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7XG4gICAgICAgICAgICAgICAgX19odG1sOlxuICAgICAgICAgICAgICAgICAgJ3dpbmRvdy5nYT1mdW5jdGlvbigpe2dhLnEucHVzaChhcmd1bWVudHMpfTtnYS5xPVtdO2dhLmw9K25ldyBEYXRlOycgK1xuICAgICAgICAgICAgICAgICAgYGdhKCdjcmVhdGUnLCcke1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuYW5hbHl0aWNzLmdvb2dsZVRyYWNraW5nSWRcbiAgICAgICAgICAgICAgICAgIH0nLCdhdXRvJyk7Z2EoJ3NlbmQnLCdwYWdldmlldycpYCxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7Y29uZmlnLmFuYWx5dGljcy5nb29nbGVUcmFja2luZ0lkICYmIChcbiAgICAgICAgICAgIDxzY3JpcHRcbiAgICAgICAgICAgICAgc3JjPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vYW5hbHl0aWNzLmpzXCJcbiAgICAgICAgICAgICAgYXN5bmNcbiAgICAgICAgICAgICAgZGVmZXJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9ib2R5PlxuICAgICAgPC9odG1sPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSHRtbDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY29tcG9uZW50cy9IdG1sLmpzIiwiLypcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuaWYgKHByb2Nlc3MuZW52LkJST1dTRVIpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICdEbyBub3QgaW1wb3J0IGBjb25maWcuanNgIGZyb20gaW5zaWRlIHRoZSBjbGllbnQtc2lkZSBjb2RlLicsXG4gICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBOb2RlLmpzIGFwcFxuICBwb3J0OiBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDAsXG5cbiAgLy8gQVBJIEdhdGV3YXlcbiAgYXBpOiB7XG4gICAgLy8gQVBJIFVSTCB0byBiZSB1c2VkIGluIHRoZSBjbGllbnQtc2lkZSBjb2RlXG4gICAgY2xpZW50VXJsOiBwcm9jZXNzLmVudi5BUElfQ0xJRU5UX1VSTCB8fCAnJyxcbiAgICAvLyBBUEkgVVJMIHRvIGJlIHVzZWQgaW4gdGhlIHNlcnZlci1zaWRlIGNvZGVcbiAgICBzZXJ2ZXJVcmw6XG4gICAgICBwcm9jZXNzLmVudi5BUElfU0VSVkVSX1VSTCB8fFxuICAgICAgYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDB9YCxcbiAgfSxcblxuICAvLyBEYXRhYmFzZVxuICBkYXRhYmFzZVVybDogcHJvY2Vzcy5lbnYuREFUQUJBU0VfVVJMIHx8ICdzcWxpdGU6ZGF0YWJhc2Uuc3FsaXRlJyxcblxuICAvLyAgTW9uZ29EYlxuICBtb25nbzoge1xuICAgIHVyaTogcHJvY2Vzcy5lbnYuTU9OR09EQl9VUkwgfHwgJ21vbmdvZGI6Ly9sb2NhbGhvc3QvcG9sYXJpcy1kZXYnLFxuICB9LFxuXG4gIC8vIFdlYiBhbmFseXRpY3NcbiAgYW5hbHl0aWNzOiB7XG4gICAgLy8gaHR0cHM6Ly9hbmFseXRpY3MuZ29vZ2xlLmNvbS9cbiAgICBnb29nbGVUcmFja2luZ0lkOiBwcm9jZXNzLmVudi5HT09HTEVfVFJBQ0tJTkdfSUQsIC8vIFVBLVhYWFhYLVhcbiAgfSxcblxuICAvLyBBdXRoZW50aWNhdGlvblxuICBhdXRoOiB7XG4gICAgand0OiB7IHNlY3JldDogcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCB8fCAnUmVhY3QgU3RhcnRlciBLaXQnIH0sXG5cbiAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZmFjZWJvb2suY29tL1xuICAgIGZhY2Vib29rOiB7XG4gICAgICBpZDogcHJvY2Vzcy5lbnYuRkFDRUJPT0tfQVBQX0lEIHx8ICcxODYyNDQ1NTE3NDU2MzEnLFxuICAgICAgc2VjcmV0OlxuICAgICAgICBwcm9jZXNzLmVudi5GQUNFQk9PS19BUFBfU0VDUkVUIHx8ICdhOTcwYWUzMjQwYWI0YjliOGFhZTBmOWYwNjYxYzZmYycsXG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vY2xvdWQuZ29vZ2xlLmNvbS9jb25zb2xlL3Byb2plY3RcbiAgICBnb29nbGU6IHtcbiAgICAgIGlkOlxuICAgICAgICBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0lEIHx8XG4gICAgICAgICcyNTE0MTA3MzA1NTAtYWhjZzBvdTVtZ2ZobDhobHVpMXVycnU3am41czEya20uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nLFxuICAgICAgc2VjcmV0OiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX1NFQ1JFVCB8fCAnWTh5Ujl5WkFobTlqUThGS0FMOFFJRWNkJyxcbiAgICB9LFxuXG4gICAgLy8gaHR0cHM6Ly9hcHBzLnR3aXR0ZXIuY29tL1xuICAgIHR3aXR0ZXI6IHtcbiAgICAgIGtleTogcHJvY2Vzcy5lbnYuVFdJVFRFUl9DT05TVU1FUl9LRVkgfHwgJ0llMjBBWnZMSkkybFFENURzZ3hnamF1bnMnLFxuICAgICAgc2VjcmV0OlxuICAgICAgICBwcm9jZXNzLmVudi5UV0lUVEVSX0NPTlNVTUVSX1NFQ1JFVCB8fFxuICAgICAgICAnS1RaNmN4b0tuRWFrUUNlU3BabGFVQ0pXR0FsVEVCSmoweTJFTWtVQnVqQTd6V1N2YVEnLFxuICAgIH0sXG4gIH0sXG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9jb25maWcuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbi8qIEBmbG93ICovXG5cbnR5cGUgRmV0Y2ggPSAodXJsOiBzdHJpbmcsIG9wdGlvbnM6ID9hbnkpID0+IFByb21pc2U8YW55PjtcblxudHlwZSBPcHRpb25zID0ge1xuICBiYXNlVXJsOiBzdHJpbmcsXG4gIGNvb2tpZT86IHN0cmluZyxcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIHdyYXBwZXIgZnVuY3Rpb24gYXJvdW5kIHRoZSBIVE1MNSBGZXRjaCBBUEkgdGhhdCBwcm92aWRlc1xuICogZGVmYXVsdCBhcmd1bWVudHMgdG8gZmV0Y2goLi4uKSBhbmQgaXMgaW50ZW5kZWQgdG8gcmVkdWNlIHRoZSBhbW91bnRcbiAqIG9mIGJvaWxlcnBsYXRlIGNvZGUgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvQVBJL0ZldGNoX0FQSS9Vc2luZ19GZXRjaFxuICovXG5mdW5jdGlvbiBjcmVhdGVGZXRjaChmZXRjaDogRmV0Y2gsIHsgYmFzZVVybCwgY29va2llIH06IE9wdGlvbnMpIHtcbiAgLy8gTk9URTogVHdlYWsgdGhlIGRlZmF1bHQgb3B0aW9ucyB0byBzdWl0ZSB5b3VyIGFwcGxpY2F0aW9uIG5lZWRzXG4gIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgIG1ldGhvZDogJ1BPU1QnLCAvLyBoYW5keSB3aXRoIEdyYXBoUUwgYmFja2VuZHNcbiAgICBtb2RlOiBiYXNlVXJsID8gJ2NvcnMnIDogJ3NhbWUtb3JpZ2luJyxcbiAgICBjcmVkZW50aWFsczogYmFzZVVybCA/ICdpbmNsdWRlJyA6ICdzYW1lLW9yaWdpbicsXG4gICAgaGVhZGVyczoge1xuICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgLi4uKGNvb2tpZSA/IHsgQ29va2llOiBjb29raWUgfSA6IG51bGwpLFxuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuICh1cmw6IHN0cmluZywgb3B0aW9uczogYW55KSA9PlxuICAgIHVybC5zdGFydHNXaXRoKCcvZ3JhcGhxbCcpIHx8IHVybC5zdGFydHNXaXRoKCcvYXBpJylcbiAgICAgID8gZmV0Y2goYCR7YmFzZVVybH0ke3VybH1gLCB7XG4gICAgICAgICAgLi4uZGVmYXVsdHMsXG4gICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAuLi5kZWZhdWx0cy5oZWFkZXJzLFxuICAgICAgICAgICAgLi4uKG9wdGlvbnMgJiYgb3B0aW9ucy5oZWFkZXJzKSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgOiBmZXRjaCh1cmwsIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGZXRjaDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY3JlYXRlRmV0Y2guanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBEYXRhVHlwZSBmcm9tICdzZXF1ZWxpemUnO1xuaW1wb3J0IE1vZGVsIGZyb20gJy4uL3NlcXVlbGl6ZSc7XG5cbmNvbnN0IFVzZXIgPSBNb2RlbC5kZWZpbmUoXG4gICdVc2VyJyxcbiAge1xuICAgIGlkOiB7XG4gICAgICB0eXBlOiBEYXRhVHlwZS5VVUlELFxuICAgICAgZGVmYXVsdFZhbHVlOiBEYXRhVHlwZS5VVUlEVjEsXG4gICAgICBwcmltYXJ5S2V5OiB0cnVlLFxuICAgIH0sXG5cbiAgICBlbWFpbDoge1xuICAgICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDI1NSksXG4gICAgICB2YWxpZGF0ZTogeyBpc0VtYWlsOiB0cnVlIH0sXG4gICAgfSxcblxuICAgIGVtYWlsQ29uZmlybWVkOiB7XG4gICAgICB0eXBlOiBEYXRhVHlwZS5CT09MRUFOLFxuICAgICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgaW5kZXhlczogW3sgZmllbGRzOiBbJ2VtYWlsJ10gfV0sXG4gIH0sXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBVc2VyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL21vZGVscy9Vc2VyLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgRGF0YVR5cGUgZnJvbSAnc2VxdWVsaXplJztcbmltcG9ydCBNb2RlbCBmcm9tICcuLi9zZXF1ZWxpemUnO1xuXG5jb25zdCBVc2VyQ2xhaW0gPSBNb2RlbC5kZWZpbmUoJ1VzZXJDbGFpbScsIHtcbiAgdHlwZToge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORyxcbiAgfSxcblxuICB2YWx1ZToge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORyxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBVc2VyQ2xhaW07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbW9kZWxzL1VzZXJDbGFpbS5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IERhdGFUeXBlIGZyb20gJ3NlcXVlbGl6ZSc7XG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vc2VxdWVsaXplJztcblxuY29uc3QgVXNlckxvZ2luID0gTW9kZWwuZGVmaW5lKCdVc2VyTG9naW4nLCB7XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoNTApLFxuICAgIHByaW1hcnlLZXk6IHRydWUsXG4gIH0sXG5cbiAga2V5OiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDEwMCksXG4gICAgcHJpbWFyeUtleTogdHJ1ZSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBVc2VyTG9naW47XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbW9kZWxzL1VzZXJMb2dpbi5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IERhdGFUeXBlIGZyb20gJ3NlcXVlbGl6ZSc7XG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vc2VxdWVsaXplJztcblxuY29uc3QgVXNlclByb2ZpbGUgPSBNb2RlbC5kZWZpbmUoJ1VzZXJQcm9maWxlJywge1xuICB1c2VySWQ6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5VVUlELFxuICAgIHByaW1hcnlLZXk6IHRydWUsXG4gIH0sXG5cbiAgZGlzcGxheU5hbWU6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMTAwKSxcbiAgfSxcblxuICBwaWN0dXJlOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDI1NSksXG4gIH0sXG5cbiAgZ2VuZGVyOiB7XG4gICAgdHlwZTogRGF0YVR5cGUuU1RSSU5HKDUwKSxcbiAgfSxcblxuICBsb2NhdGlvbjoge1xuICAgIHR5cGU6IERhdGFUeXBlLlNUUklORygxMDApLFxuICB9LFxuXG4gIHdlYnNpdGU6IHtcbiAgICB0eXBlOiBEYXRhVHlwZS5TVFJJTkcoMjU1KSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBVc2VyUHJvZmlsZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9tb2RlbHMvVXNlclByb2ZpbGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBzZXF1ZWxpemUgZnJvbSAnLi4vc2VxdWVsaXplJztcbmltcG9ydCBVc2VyIGZyb20gJy4vVXNlcic7XG5pbXBvcnQgVXNlckxvZ2luIGZyb20gJy4vVXNlckxvZ2luJztcbmltcG9ydCBVc2VyQ2xhaW0gZnJvbSAnLi9Vc2VyQ2xhaW0nO1xuaW1wb3J0IFVzZXJQcm9maWxlIGZyb20gJy4vVXNlclByb2ZpbGUnO1xuXG5Vc2VyLmhhc01hbnkoVXNlckxvZ2luLCB7XG4gIGZvcmVpZ25LZXk6ICd1c2VySWQnLFxuICBhczogJ2xvZ2lucycsXG4gIG9uVXBkYXRlOiAnY2FzY2FkZScsXG4gIG9uRGVsZXRlOiAnY2FzY2FkZScsXG59KTtcblxuVXNlci5oYXNNYW55KFVzZXJDbGFpbSwge1xuICBmb3JlaWduS2V5OiAndXNlcklkJyxcbiAgYXM6ICdjbGFpbXMnLFxuICBvblVwZGF0ZTogJ2Nhc2NhZGUnLFxuICBvbkRlbGV0ZTogJ2Nhc2NhZGUnLFxufSk7XG5cblVzZXIuaGFzT25lKFVzZXJQcm9maWxlLCB7XG4gIGZvcmVpZ25LZXk6ICd1c2VySWQnLFxuICBhczogJ3Byb2ZpbGUnLFxuICBvblVwZGF0ZTogJ2Nhc2NhZGUnLFxuICBvbkRlbGV0ZTogJ2Nhc2NhZGUnLFxufSk7XG5cbmZ1bmN0aW9uIHN5bmMoLi4uYXJncykge1xuICByZXR1cm4gc2VxdWVsaXplLnN5bmMoLi4uYXJncyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgc3luYyB9O1xuZXhwb3J0IHsgVXNlciwgVXNlckxvZ2luLCBVc2VyQ2xhaW0sIFVzZXJQcm9maWxlIH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvbW9kZWxzL2luZGV4LmpzIiwiaW1wb3J0IHtcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMTGlzdCBhcyBMaXN0LFxuICBHcmFwaFFMSW50IGFzIEludFR5cGUsXG59IGZyb20gJ2dyYXBocWwnO1xuXG5pbXBvcnQgQ1dVQW5hbHlzaXNSZXBvcnRUeXBlIGZyb20gJy4uL3R5cGVzL0NXVUFuYWx5c2lzUmVwb3J0VHlwZSc7XG5pbXBvcnQgQ1dVQW5hbHlzaXNSZXBvcnQgZnJvbSAnLi8uLi8uLi9hcGkvY3d1QW5hbHlzaXNSZXBvcnQvY3d1QW5hbHlzaXNSZXBvcnQubW9kZWwnO1xuXG5jb25zdCBjd3VBbmFseXNpc1JlcG9ydCA9IHtcbiAgYXJnczoge1xuICAgIHRlc3RJZDogeyB0eXBlOiBTdHJpbmdUeXBlIH0sXG4gICAgYWNhZGVtaWNZZWFyOiB7IHR5cGU6IEludFR5cGUgfSxcbiAgfSxcbiAgdHlwZTogbmV3IExpc3QoQ1dVQW5hbHlzaXNSZXBvcnRUeXBlKSxcbiAgYXN5bmMgcmVzb2x2ZShvYmosIGFyZ3MpIHtcbiAgICBjb25zdCBtYXN0ZXJSZXN1bHRzID0gYXdhaXQgQ1dVQW5hbHlzaXNSZXBvcnQuZmluZCh7XG4gICAgICB0ZXN0SWQ6IGFyZ3MudGVzdElkLFxuICAgICAgYWNhZGVtaWNZZWFyOiBhcmdzLmFjYWRlbWljWWVhcixcbiAgICB9KS5leGVjKCk7XG5cbiAgICByZXR1cm4gbWFzdGVyUmVzdWx0cztcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGN3dUFuYWx5c2lzUmVwb3J0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3F1ZXJpZXMvQ1dVQW5hbHlzaXNSZXBvcnQuanMiLCJpbXBvcnQge1xuICBHcmFwaFFMU3RyaW5nIGFzIFN0cmluZ1R5cGUsXG4gIEdyYXBoUUxMaXN0IGFzIExpc3QsXG4gIEdyYXBoUUxJbnQgYXMgSW50VHlwZSxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5cbmltcG9ydCBBbGxJbmRpYU1hcmtzQW5hbHlzaXNUeXBlIGZyb20gJy4uL3R5cGVzL0FsbEluZGlhTWFya3NBbmFseXNpc1R5cGUnO1xuaW1wb3J0IEFsbEluZGlhTWFya3NBbmFseXNpc1JlcG9ydCBmcm9tICcuLy4uLy4uL2FwaS9hbGxJbmRpYU1hcmtzQW5hbHlzaXNSZXBvcnQvYWxsSW5kaWFNYXJrc0FuYWx5c2lzUmVwb3J0Lm1vZGVsJztcblxuY29uc3QgYWxsSW5kaWFNYXJrc0FuYWx5c2lzUmVwb3J0ID0ge1xuICBhcmdzOiB7XG4gICAgdGVzdElkOiB7IHR5cGU6IFN0cmluZ1R5cGUgfSxcbiAgICBhY2FkZW1pY1llYXI6IHsgdHlwZTogSW50VHlwZSB9LFxuICB9LFxuICB0eXBlOiBuZXcgTGlzdChBbGxJbmRpYU1hcmtzQW5hbHlzaXNUeXBlKSxcbiAgYXN5bmMgcmVzb2x2ZShvYmosIGFyZ3MpIHtcbiAgICBjb25zdCBtYXN0ZXJSZXN1bHRzID0gYXdhaXQgQWxsSW5kaWFNYXJrc0FuYWx5c2lzUmVwb3J0LmZpbmQoe1xuICAgICAgdGVzdElkOiBhcmdzLnRlc3RJZCxcbiAgICAgIGFjYWRlbWljWWVhcjogYXJncy5hY2FkZW1pY1llYXIsXG4gICAgfSkuZXhlYygpO1xuXG4gICAgcmV0dXJuIG1hc3RlclJlc3VsdHM7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBhbGxJbmRpYU1hcmtzQW5hbHlzaXNSZXBvcnQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvcXVlcmllcy9hbGxJbmRpYU1hcmtzQW5hbHlzaXNSZXBvcnQuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBVc2VyVHlwZSBmcm9tICcuLi90eXBlcy9Vc2VyVHlwZSc7XG5cbmNvbnN0IG1lID0ge1xuICB0eXBlOiBVc2VyVHlwZSxcbiAgcmVzb2x2ZSh7IHJlcXVlc3QgfSkge1xuICAgIHJldHVybiAoXG4gICAgICByZXF1ZXN0LnVzZXIgJiYge1xuICAgICAgICBpZDogcmVxdWVzdC51c2VyLmlkLFxuICAgICAgICBlbWFpbDogcmVxdWVzdC51c2VyLmVtYWlsLFxuICAgICAgfVxuICAgICk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBtZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL21lLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgeyBHcmFwaFFMTGlzdCBhcyBMaXN0IH0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5pbXBvcnQgTmV3c0l0ZW1UeXBlIGZyb20gJy4uL3R5cGVzL05ld3NJdGVtVHlwZSc7XG5cbi8vIFJlYWN0LmpzIE5ld3MgRmVlZCAoUlNTKVxuY29uc3QgdXJsID1cbiAgJ2h0dHBzOi8vYXBpLnJzczJqc29uLmNvbS92MS9hcGkuanNvbicgK1xuICAnP3Jzc191cmw9aHR0cHMlM0ElMkYlMkZyZWFjdGpzbmV3cy5jb20lMkZmZWVkLnhtbCc7XG5cbmxldCBpdGVtcyA9IFtdO1xubGV0IGxhc3RGZXRjaFRhc2s7XG5sZXQgbGFzdEZldGNoVGltZSA9IG5ldyBEYXRlKDE5NzAsIDAsIDEpO1xuXG5jb25zdCBuZXdzID0ge1xuICB0eXBlOiBuZXcgTGlzdChOZXdzSXRlbVR5cGUpLFxuICByZXNvbHZlKCkge1xuICAgIGlmIChsYXN0RmV0Y2hUYXNrKSB7XG4gICAgICByZXR1cm4gbGFzdEZldGNoVGFzaztcbiAgICB9XG5cbiAgICBpZiAobmV3IERhdGUoKSAtIGxhc3RGZXRjaFRpbWUgPiAxMDAwICogNjAgKiAxMCAvKiAxMCBtaW5zICovKSB7XG4gICAgICBsYXN0RmV0Y2hUaW1lID0gbmV3IERhdGUoKTtcbiAgICAgIGxhc3RGZXRjaFRhc2sgPSBmZXRjaCh1cmwpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgICBpdGVtcyA9IGRhdGEuaXRlbXM7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGFzdEZldGNoVGFzayA9IG51bGw7XG4gICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBsYXN0RmV0Y2hUYXNrID0gbnVsbDtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0pO1xuXG4gICAgICBpZiAoaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBpdGVtcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGxhc3RGZXRjaFRhc2s7XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgbmV3cztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS9xdWVyaWVzL25ld3MuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxTY2hlbWEgYXMgU2NoZW1hLFxuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxufSBmcm9tICdncmFwaHFsJztcblxuaW1wb3J0IG1lIGZyb20gJy4vcXVlcmllcy9tZSc7XG5pbXBvcnQgbmV3cyBmcm9tICcuL3F1ZXJpZXMvbmV3cyc7XG5pbXBvcnQgYWxsSW5kaWFNYXJrc0FuYWx5c2lzUmVwb3J0IGZyb20gJy4vcXVlcmllcy9hbGxJbmRpYU1hcmtzQW5hbHlzaXNSZXBvcnQnO1xuaW1wb3J0IGN3dUFuYWx5c2lzUmVwb3J0IGZyb20gJy4vcXVlcmllcy9DV1VBbmFseXNpc1JlcG9ydCc7XG5cbmNvbnN0IHNjaGVtYSA9IG5ldyBTY2hlbWEoe1xuICBxdWVyeTogbmV3IE9iamVjdFR5cGUoe1xuICAgIG5hbWU6ICdRdWVyeScsXG4gICAgZmllbGRzOiB7XG4gICAgICBtZSxcbiAgICAgIG5ld3MsXG4gICAgICBhbGxJbmRpYU1hcmtzQW5hbHlzaXNSZXBvcnQsXG4gICAgICBjd3VBbmFseXNpc1JlcG9ydCxcbiAgICB9LFxuICB9KSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBzY2hlbWE7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvc2NoZW1hLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgU2VxdWVsaXplIGZyb20gJ3NlcXVlbGl6ZSc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5cbmNvbnN0IHNlcXVlbGl6ZSA9IG5ldyBTZXF1ZWxpemUoY29uZmlnLmRhdGFiYXNlVXJsLCB7XG4gIGRlZmluZToge1xuICAgIGZyZWV6ZVRhYmxlTmFtZTogdHJ1ZSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBzZXF1ZWxpemU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvc2VxdWVsaXplLmpzIiwiaW1wb3J0IHtcbiAgR3JhcGhRTE9iamVjdFR5cGUgYXMgT2JqZWN0VHlwZSxcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMSW50IGFzIEludFR5cGUsXG4gIEdyYXBoUUxMaXN0IGFzIExpc3QsXG59IGZyb20gJ2dyYXBocWwnO1xuXG5jb25zdCBSZXBvcnRUeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnUmVwb3J0JyxcbiAgZmllbGRzOiB7XG4gICAgcm9sbE51bWJlcjogeyB0eXBlOiBTdHJpbmdUeXBlIH0sXG4gICAgbmFtZTogeyB0eXBlOiBTdHJpbmdUeXBlIH0sXG4gICAgY2FtcHVzSWQ6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuXG4gICAgcGh5TWFya3MxMjA6IHsgdHlwZTogSW50VHlwZSB9LFxuICAgIGNoZU1hcmtzMTIwOiB7IHR5cGU6IEludFR5cGUgfSxcbiAgICBtYXRNYXJrczEyMDogeyB0eXBlOiBJbnRUeXBlIH0sXG5cbiAgICBwaHlSYW5rOiB7IHR5cGU6IEludFR5cGUgfSxcbiAgICBjaGVSYW5rOiB7IHR5cGU6IEludFR5cGUgfSxcbiAgICBtYXRSYW5rOiB7IHR5cGU6IEludFR5cGUgfSxcblxuICAgIG92ZXJhbGxNYXJrczogeyB0eXBlOiBJbnRUeXBlIH0sXG4gICAgb3ZlcmFsbFJhbms6IHsgdHlwZTogSW50VHlwZSB9LFxuICB9LFxufSk7XG5cbmNvbnN0IEFsbEluZGlhTWFya3NBbmFseXNpc1R5cGUgPSBuZXcgT2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdBbGxJbmRpYU1hcmtzQW5hbHlzaXMnLFxuICBmaWVsZHM6IHtcbiAgICB0ZXN0SWQ6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuICAgIHJlcG9ydHM6IHsgdHlwZTogbmV3IExpc3QoUmVwb3J0VHlwZSkgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBbGxJbmRpYU1hcmtzQW5hbHlzaXNUeXBlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3R5cGVzL0FsbEluZGlhTWFya3NBbmFseXNpc1R5cGUuanMiLCJpbXBvcnQge1xuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxuICBHcmFwaFFMU3RyaW5nIGFzIFN0cmluZ1R5cGUsXG4gIEdyYXBoUUxJbnQgYXMgSW50VHlwZSxcbiAgR3JhcGhRTExpc3QgYXMgTGlzdCxcbn0gZnJvbSAnZ3JhcGhxbCc7XG5cbmNvbnN0IENXVVJlcG9ydFR5cGUgPSBuZXcgT2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdDV1VSZXBvcnQnLFxuICBmaWVsZHM6IHtcbiAgICByb2xsTnVtYmVyOiB7IHR5cGU6IFN0cmluZ1R5cGUgfSxcbiAgICBuYW1lOiB7IHR5cGU6IFN0cmluZ1R5cGUgfSxcbiAgICBjYW1wdXNJZDogeyB0eXBlOiBTdHJpbmdUeXBlIH0sXG5cbiAgICBQaHlzaWNzX0M6IHsgdHlwZTogSW50VHlwZSB9LFxuICAgIFBoeXNpY3NfVzogeyB0eXBlOiBJbnRUeXBlIH0sXG4gICAgUGh5c2ljc19VOiB7IHR5cGU6IEludFR5cGUgfSxcblxuICAgIENoZW1pc3RyeV9DOiB7IHR5cGU6IEludFR5cGUgfSxcbiAgICBDaGVtaXN0cnlfVzogeyB0eXBlOiBJbnRUeXBlIH0sXG4gICAgQ2hlbWlzdHJ5X1U6IHsgdHlwZTogSW50VHlwZSB9LFxuXG4gICAgTWF0aHNfQzogeyB0eXBlOiBJbnRUeXBlIH0sXG4gICAgTWF0aHNfVzogeyB0eXBlOiBJbnRUeXBlIH0sXG4gICAgTWF0aHNfVTogeyB0eXBlOiBJbnRUeXBlIH0sXG4gIH0sXG59KTtcblxuY29uc3QgQ1dVQW5hbHlzaXNSZXBvcnRUeXBlID0gbmV3IE9iamVjdFR5cGUoe1xuICBuYW1lOiAnQ1dVQW5hbHlzaXNSZXBvcnQnLFxuICBmaWVsZHM6IHtcbiAgICB0ZXN0SWQ6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuICAgIHJlcG9ydHM6IHsgdHlwZTogbmV3IExpc3QoQ1dVUmVwb3J0VHlwZSkgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBDV1VBbmFseXNpc1JlcG9ydFR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2RhdGEvdHlwZXMvQ1dVQW5hbHlzaXNSZXBvcnRUeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQge1xuICBHcmFwaFFMT2JqZWN0VHlwZSBhcyBPYmplY3RUeXBlLFxuICBHcmFwaFFMU3RyaW5nIGFzIFN0cmluZ1R5cGUsXG4gIEdyYXBoUUxOb25OdWxsIGFzIE5vbk51bGwsXG59IGZyb20gJ2dyYXBocWwnO1xuXG5jb25zdCBOZXdzSXRlbVR5cGUgPSBuZXcgT2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdOZXdzSXRlbScsXG4gIGZpZWxkczoge1xuICAgIHRpdGxlOiB7IHR5cGU6IG5ldyBOb25OdWxsKFN0cmluZ1R5cGUpIH0sXG4gICAgbGluazogeyB0eXBlOiBuZXcgTm9uTnVsbChTdHJpbmdUeXBlKSB9LFxuICAgIGF1dGhvcjogeyB0eXBlOiBTdHJpbmdUeXBlIH0sXG4gICAgcHViRGF0ZTogeyB0eXBlOiBuZXcgTm9uTnVsbChTdHJpbmdUeXBlKSB9LFxuICAgIGNvbnRlbnQ6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IE5ld3NJdGVtVHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvZGF0YS90eXBlcy9OZXdzSXRlbVR5cGUuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB7XG4gIEdyYXBoUUxPYmplY3RUeXBlIGFzIE9iamVjdFR5cGUsXG4gIEdyYXBoUUxJRCBhcyBJRCxcbiAgR3JhcGhRTFN0cmluZyBhcyBTdHJpbmdUeXBlLFxuICBHcmFwaFFMTm9uTnVsbCBhcyBOb25OdWxsLFxufSBmcm9tICdncmFwaHFsJztcblxuY29uc3QgVXNlclR5cGUgPSBuZXcgT2JqZWN0VHlwZSh7XG4gIG5hbWU6ICdVc2VyJyxcbiAgZmllbGRzOiB7XG4gICAgaWQ6IHsgdHlwZTogbmV3IE5vbk51bGwoSUQpIH0sXG4gICAgZW1haWw6IHsgdHlwZTogU3RyaW5nVHlwZSB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJUeXBlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9kYXRhL3R5cGVzL1VzZXJUeXBlLmpzIiwiLyoqXG4gKiBSZWFjdCBTdGFydGVyIEtpdCAoaHR0cHM6Ly93d3cucmVhY3RzdGFydGVya2l0LmNvbS8pXG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQtcHJlc2VudCBLcmlhc29mdCwgTExDLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4vKipcbiAqIFBhc3Nwb3J0LmpzIHJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbi5cbiAqIFRoZSBkYXRhYmFzZSBzY2hlbWEgdXNlZCBpbiB0aGlzIHNhbXBsZSBpcyBhdmFpbGFibGUgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tZW1iZXJzaGlwL21lbWJlcnNoaXAuZGIvdHJlZS9tYXN0ZXIvcG9zdGdyZXNcbiAqL1xuXG5pbXBvcnQgcGFzc3BvcnQgZnJvbSAncGFzc3BvcnQnO1xuaW1wb3J0IHsgU3RyYXRlZ3kgYXMgRmFjZWJvb2tTdHJhdGVneSB9IGZyb20gJ3Bhc3Nwb3J0LWZhY2Vib29rJztcbmltcG9ydCB7IFVzZXIsIFVzZXJMb2dpbiwgVXNlckNsYWltLCBVc2VyUHJvZmlsZSB9IGZyb20gJy4vZGF0YS9tb2RlbHMnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5cbi8qKlxuICogU2lnbiBpbiB3aXRoIEZhY2Vib29rLlxuICovXG5wYXNzcG9ydC51c2UoXG4gIG5ldyBGYWNlYm9va1N0cmF0ZWd5KFxuICAgIHtcbiAgICAgIGNsaWVudElEOiBjb25maWcuYXV0aC5mYWNlYm9vay5pZCxcbiAgICAgIGNsaWVudFNlY3JldDogY29uZmlnLmF1dGguZmFjZWJvb2suc2VjcmV0LFxuICAgICAgY2FsbGJhY2tVUkw6ICcvbG9naW4vZmFjZWJvb2svcmV0dXJuJyxcbiAgICAgIHByb2ZpbGVGaWVsZHM6IFtcbiAgICAgICAgJ2Rpc3BsYXlOYW1lJyxcbiAgICAgICAgJ25hbWUnLFxuICAgICAgICAnZW1haWwnLFxuICAgICAgICAnbGluaycsXG4gICAgICAgICdsb2NhbGUnLFxuICAgICAgICAndGltZXpvbmUnLFxuICAgICAgXSxcbiAgICAgIHBhc3NSZXFUb0NhbGxiYWNrOiB0cnVlLFxuICAgIH0sXG4gICAgKHJlcSwgYWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbiwgcHJvZmlsZSwgZG9uZSkgPT4ge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cbiAgICAgIGNvbnN0IGxvZ2luTmFtZSA9ICdmYWNlYm9vayc7XG4gICAgICBjb25zdCBjbGFpbVR5cGUgPSAndXJuOmZhY2Vib29rOmFjY2Vzc190b2tlbic7XG4gICAgICBjb25zdCBmb29CYXIgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmIChyZXEudXNlcikge1xuICAgICAgICAgIGNvbnN0IHVzZXJMb2dpbiA9IGF3YWl0IFVzZXJMb2dpbi5maW5kT25lKHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IFsnbmFtZScsICdrZXknXSxcbiAgICAgICAgICAgIHdoZXJlOiB7IG5hbWU6IGxvZ2luTmFtZSwga2V5OiBwcm9maWxlLmlkIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKHVzZXJMb2dpbikge1xuICAgICAgICAgICAgLy8gVGhlcmUgaXMgYWxyZWFkeSBhIEZhY2Vib29rIGFjY291bnQgdGhhdCBiZWxvbmdzIHRvIHlvdS5cbiAgICAgICAgICAgIC8vIFNpZ24gaW4gd2l0aCB0aGF0IGFjY291bnQgb3IgZGVsZXRlIGl0LCB0aGVuIGxpbmsgaXQgd2l0aCB5b3VyIGN1cnJlbnQgYWNjb3VudC5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIuY3JlYXRlKFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IHJlcS51c2VyLmlkLFxuICAgICAgICAgICAgICAgIGVtYWlsOiBwcm9maWxlLl9qc29uLmVtYWlsLFxuICAgICAgICAgICAgICAgIGxvZ2luczogW3sgbmFtZTogbG9naW5OYW1lLCBrZXk6IHByb2ZpbGUuaWQgfV0sXG4gICAgICAgICAgICAgICAgY2xhaW1zOiBbeyB0eXBlOiBjbGFpbVR5cGUsIHZhbHVlOiBwcm9maWxlLmlkIH1dLFxuICAgICAgICAgICAgICAgIHByb2ZpbGU6IHtcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBwcm9maWxlLmRpc3BsYXlOYW1lLFxuICAgICAgICAgICAgICAgICAgZ2VuZGVyOiBwcm9maWxlLl9qc29uLmdlbmRlcixcbiAgICAgICAgICAgICAgICAgIHBpY3R1cmU6IGBodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Byb2ZpbGUuaWR9L3BpY3R1cmU/dHlwZT1sYXJnZWAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgICAgICAgICAgIHsgbW9kZWw6IFVzZXJMb2dpbiwgYXM6ICdsb2dpbnMnIH0sXG4gICAgICAgICAgICAgICAgICB7IG1vZGVsOiBVc2VyQ2xhaW0sIGFzOiAnY2xhaW1zJyB9LFxuICAgICAgICAgICAgICAgICAgeyBtb2RlbDogVXNlclByb2ZpbGUsIGFzOiAncHJvZmlsZScgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRvbmUobnVsbCwge1xuICAgICAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdXNlcnMgPSBhd2FpdCBVc2VyLmZpbmRBbGwoe1xuICAgICAgICAgICAgYXR0cmlidXRlczogWydpZCcsICdlbWFpbCddLFxuICAgICAgICAgICAgd2hlcmU6IHsgJyRsb2dpbnMubmFtZSQnOiBsb2dpbk5hbWUsICckbG9naW5zLmtleSQnOiBwcm9maWxlLmlkIH0sXG4gICAgICAgICAgICBpbmNsdWRlOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBbJ25hbWUnLCAna2V5J10sXG4gICAgICAgICAgICAgICAgbW9kZWw6IFVzZXJMb2dpbixcbiAgICAgICAgICAgICAgICBhczogJ2xvZ2lucycsXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh1c2Vycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHVzZXIgPSB1c2Vyc1swXS5nZXQoeyBwbGFpbjogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGRvbmUobnVsbCwgdXNlcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB1c2VyID0gYXdhaXQgVXNlci5maW5kT25lKHtcbiAgICAgICAgICAgICAgd2hlcmU6IHsgZW1haWw6IHByb2ZpbGUuX2pzb24uZW1haWwgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgLy8gVGhlcmUgaXMgYWxyZWFkeSBhbiBhY2NvdW50IHVzaW5nIHRoaXMgZW1haWwgYWRkcmVzcy4gU2lnbiBpbiB0b1xuICAgICAgICAgICAgICAvLyB0aGF0IGFjY291bnQgYW5kIGxpbmsgaXQgd2l0aCBGYWNlYm9vayBtYW51YWxseSBmcm9tIEFjY291bnQgU2V0dGluZ3MuXG4gICAgICAgICAgICAgIGRvbmUobnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1c2VyID0gYXdhaXQgVXNlci5jcmVhdGUoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZW1haWw6IHByb2ZpbGUuX2pzb24uZW1haWwsXG4gICAgICAgICAgICAgICAgICBlbWFpbENvbmZpcm1lZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIGxvZ2luczogW3sgbmFtZTogbG9naW5OYW1lLCBrZXk6IHByb2ZpbGUuaWQgfV0sXG4gICAgICAgICAgICAgICAgICBjbGFpbXM6IFt7IHR5cGU6IGNsYWltVHlwZSwgdmFsdWU6IGFjY2Vzc1Rva2VuIH1dLFxuICAgICAgICAgICAgICAgICAgcHJvZmlsZToge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogcHJvZmlsZS5kaXNwbGF5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZGVyOiBwcm9maWxlLl9qc29uLmdlbmRlcixcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZTogYGh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cHJvZmlsZS5pZH0vcGljdHVyZT90eXBlPWxhcmdlYCxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBpbmNsdWRlOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgbW9kZWw6IFVzZXJMb2dpbiwgYXM6ICdsb2dpbnMnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbW9kZWw6IFVzZXJDbGFpbSwgYXM6ICdjbGFpbXMnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbW9kZWw6IFVzZXJQcm9maWxlLCBhczogJ3Byb2ZpbGUnIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGRvbmUobnVsbCwge1xuICAgICAgICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZvb0JhcigpLmNhdGNoKGRvbmUpO1xuICAgIH0sXG4gICksXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBwYXNzcG9ydDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvcGFzc3BvcnQuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBSb3V0ZXIgZnJvbSAndW5pdmVyc2FsLXJvdXRlcic7XG5pbXBvcnQgcm91dGVzIGZyb20gJy4vcm91dGVzJztcblxuZXhwb3J0IGRlZmF1bHQgbmV3IFJvdXRlcihyb3V0ZXMsIHtcbiAgcmVzb2x2ZVJvdXRlKGNvbnRleHQsIHBhcmFtcykge1xuICAgIGlmICh0eXBlb2YgY29udGV4dC5yb3V0ZS5sb2FkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gY29udGV4dC5yb3V0ZVxuICAgICAgICAubG9hZCgpXG4gICAgICAgIC50aGVuKGFjdGlvbiA9PiBhY3Rpb24uZGVmYXVsdChjb250ZXh0LCBwYXJhbXMpKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjb250ZXh0LnJvdXRlLmFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGNvbnRleHQucm91dGUuYWN0aW9uKGNvbnRleHQsIHBhcmFtcyk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LFxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3JvdXRlci5qcyIsIlxuICAgIHZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS1ydWxlcy0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS1ydWxlcy0zIS4vRXJyb3JQYWdlLmNzc1wiKTtcbiAgICB2YXIgaW5zZXJ0Q3NzID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvaXNvbW9ycGhpYy1zdHlsZS1sb2FkZXIvbGliL2luc2VydENzcy5qc1wiKTtcblxuICAgIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzIHx8IHt9O1xuICAgIG1vZHVsZS5leHBvcnRzLl9nZXRDb250ZW50ID0gZnVuY3Rpb24oKSB7IHJldHVybiBjb250ZW50OyB9O1xuICAgIG1vZHVsZS5leHBvcnRzLl9nZXRDc3MgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbnRlbnQudG9TdHJpbmcoKTsgfTtcbiAgICBtb2R1bGUuZXhwb3J0cy5faW5zZXJ0Q3NzID0gZnVuY3Rpb24ob3B0aW9ucykgeyByZXR1cm4gaW5zZXJ0Q3NzKGNvbnRlbnQsIG9wdGlvbnMpIH07XG4gICAgXG4gICAgLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuICAgIC8vIGh0dHBzOi8vd2VicGFjay5naXRodWIuaW8vZG9jcy9ob3QtbW9kdWxlLXJlcGxhY2VtZW50XG4gICAgLy8gT25seSBhY3RpdmF0ZWQgaW4gYnJvd3NlciBjb250ZXh0XG4gICAgaWYgKG1vZHVsZS5ob3QgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50KSB7XG4gICAgICB2YXIgcmVtb3ZlQ3NzID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLXJ1bGVzLTIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLXJ1bGVzLTMhLi9FcnJvclBhZ2UuY3NzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS1ydWxlcy0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS1ydWxlcy0zIS4vRXJyb3JQYWdlLmNzc1wiKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlQ3NzID0gaW5zZXJ0Q3NzKGNvbnRlbnQsIHsgcmVwbGFjZTogdHJ1ZSB9KTtcbiAgICAgIH0pO1xuICAgICAgbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyByZW1vdmVDc3MoKTsgfSk7XG4gICAgfVxuICBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9yb3V0ZXMvZXJyb3IvRXJyb3JQYWdlLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9zcmMvcm91dGVzL2Vycm9yL0Vycm9yUGFnZS5jc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSAxNCIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgd2l0aFN0eWxlcyBmcm9tICdpc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvd2l0aFN0eWxlcyc7XG5pbXBvcnQgcyBmcm9tICcuL0Vycm9yUGFnZS5jc3MnO1xuXG5jbGFzcyBFcnJvclBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVycm9yOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgbWVzc2FnZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgc3RhY2s6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9KSxcbiAgfTtcblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGVycm9yOiBudWxsLFxuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoX19ERVZfXyAmJiB0aGlzLnByb3BzLmVycm9yKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoMT57dGhpcy5wcm9wcy5lcnJvci5uYW1lfTwvaDE+XG4gICAgICAgICAgPHByZT57dGhpcy5wcm9wcy5lcnJvci5zdGFja308L3ByZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aDE+RXJyb3I8L2gxPlxuICAgICAgICA8cD5Tb3JyeSwgYSBjcml0aWNhbCBlcnJvciBvY2N1cnJlZCBvbiB0aGlzIHBhZ2UuPC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgeyBFcnJvclBhZ2UgYXMgRXJyb3JQYWdlV2l0aG91dFN0eWxlIH07XG5leHBvcnQgZGVmYXVsdCB3aXRoU3R5bGVzKHMpKEVycm9yUGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UuanMiLCIvKipcbiAqIFJlYWN0IFN0YXJ0ZXIgS2l0IChodHRwczovL3d3dy5yZWFjdHN0YXJ0ZXJraXQuY29tLylcbiAqXG4gKiBDb3B5cmlnaHQgwqkgMjAxNC1wcmVzZW50IEtyaWFzb2Z0LCBMTEMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRXJyb3JQYWdlIGZyb20gJy4vRXJyb3JQYWdlJztcblxuZnVuY3Rpb24gYWN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHRpdGxlOiAnRGVtbyBFcnJvcicsXG4gICAgY29tcG9uZW50OiA8RXJyb3JQYWdlIC8+LFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhY3Rpb247XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3JvdXRlcy9lcnJvci9pbmRleC5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgZ2xvYmFsLXJlcXVpcmUgKi9cblxuLy8gVGhlIHRvcC1sZXZlbCAocGFyZW50KSByb3V0ZVxuY29uc3Qgcm91dGVzID0ge1xuICBwYXRoOiAnLycsXG5cbiAgLy8gS2VlcCBpbiBtaW5kLCByb3V0ZXMgYXJlIGV2YWx1YXRlZCBpbiBvcmRlclxuICBjaGlsZHJlbjogW1xuICAgIHtcbiAgICAgIHBhdGg6ICcvJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAnaG9tZScgKi8gJy4vaG9tZScpLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9yZXBvcnRzJyxcbiAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwYXRoOiAnJyxcbiAgICAgICAgICBsb2FkOiAoKSA9PiBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ3JlcG9ydHMnICovICcuL3JlcG9ydHMnKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhdGg6ICcvdmlldycsXG4gICAgICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICd2aWV3UmVwb3J0cycgKi8gJy4vcmVwb3J0cy92aWV3JyksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwYXRoOiAnL292ZXJBbGxBdmVyYWdlcycsXG4gICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcGF0aDogJy90b3RhbCcsXG4gICAgICAgICAgICAgIGxvYWQ6ICgpID0+XG4gICAgICAgICAgICAgICAgaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICd2aWV3UmVwb3J0JyAqLyAnLi9yZXBvcnRzL292ZXJBbGxBdmVyYWdlcy90b3RhbCcpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcGF0aDogJy9jYW1wdXMnLFxuICAgICAgICAgICAgICBsb2FkOiAoKSA9PlxuICAgICAgICAgICAgICAgIGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAndmlld1JlcG9ydCcgKi8gJy4vcmVwb3J0cy9vdmVyQWxsQXZlcmFnZXMvY2FtcHVzJyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwYXRoOiAnL3NlY3Rpb25BdmVyYWdlcycsXG4gICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcGF0aDogJy9zZWN0aW9uJyxcbiAgICAgICAgICAgICAgbG9hZDogKCkgPT5cbiAgICAgICAgICAgICAgICBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ3ZpZXdSZXBvcnQnICovICcuL3JlcG9ydHMvc2VjdGlvbkF2ZXJhZ2VzL3NlY3Rpb24nKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHBhdGg6ICcvc2VjdGlvblRvcHBlcnMnLFxuICAgICAgICAgICAgICBsb2FkOiAoKSA9PlxuICAgICAgICAgICAgICAgIGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAndmlld1JlcG9ydCcgKi8gJy4vcmVwb3J0cy9zZWN0aW9uQXZlcmFnZXMvc2VjdGlvblRvcHBlcnMnKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhdGg6ICcvY2FtcHVzVG9wcGVycycsXG4gICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcGF0aDogJy9jYW1wdXNUb3BwZXInLFxuICAgICAgICAgICAgICBsb2FkOiAoKSA9PlxuICAgICAgICAgICAgICAgIGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAndmlld1JlcG9ydCcgKi8gJy4vcmVwb3J0cy9jYW1wdXNUb3BwZXJzL2NhbXB1c1RvcHBlcicpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcGF0aDogJy90b3BwZXInLFxuICAgICAgICAgICAgICBsb2FkOiAoKSA9PlxuICAgICAgICAgICAgICAgIGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAndmlld1JlcG9ydCcgKi8gJy4vcmVwb3J0cy9jYW1wdXNUb3BwZXJzL3RvcHBlcicpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHBhdGg6ICcvdGVhY2hlcnMnLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICd0ZWFjaGVycycgKi8gJy4vdGVhY2hlcnMnKSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHBhdGg6ICcvY2FtcHVzJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAnY2FtcHVzJyAqLyAnLi9jYW1wdXMnKSxcbiAgICB9LFxuICAgIHtcbiAgICBcdHBhdGg6ICcvZ3JhcGhzJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAnZ3JhcGhzJyAqLyAnLi9ncmFwaHMnKSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHBhdGg6ICcvc3R1ZGVudHMnLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICdzdHVkZW50cycgKi8gJy4vc3R1ZGVudHMnKSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHBhdGg6ICcvdGVzdHMnLFxuICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAge1xuICAgICAgICAgIHBhdGg6ICcnLFxuICAgICAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAndGVzdHMnICovICcuL3Rlc3RzJyksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwYXRoOiAnL25ld1Rlc3QnLFxuICAgICAgICAgIGxvYWQ6ICgpID0+XG4gICAgICAgICAgICBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ25ld1Rlc3QnICovICcuL3Rlc3RzL25ld1Rlc3QnKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhdGg6ICcvdXBsb2FkZWQnLFxuICAgICAgICAgIGxvYWQ6ICgpID0+XG4gICAgICAgICAgICBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ3Rlc3RVcGxvYWRlZCcgKi8gJy4vdGVzdHMvdXBsb2FkZWQnKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhdGg6ICcvdXBsb2FkRXJyb3InLFxuICAgICAgICAgIGxvYWQ6ICgpID0+XG4gICAgICAgICAgICBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogJ3VwbG9hZEVycm9yJyAqLyAnLi90ZXN0cy91cGxvYWRFcnJvcicpLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHBhdGg6ICcvc2V0dGluZ3MnLFxuICAgICAgbG9hZDogKCkgPT4gaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6ICdzZXR0aW5ncycgKi8gJy4vc2V0dGluZ3MnKSxcbiAgICB9LFxuXG4gICAgLy8gV2lsZGNhcmQgcm91dGVzLCBlLmcuIHsgcGF0aDogJyonLCAuLi4gfSAobXVzdCBnbyBsYXN0KVxuICAgIHtcbiAgICAgIHBhdGg6ICcqJyxcbiAgICAgIGxvYWQ6ICgpID0+IGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiAnbm90LWZvdW5kJyAqLyAnLi9ub3QtZm91bmQnKSxcbiAgICB9LFxuICBdLFxuXG4gIGFzeW5jIGFjdGlvbih7IG5leHQgfSkge1xuICAgIC8vIEV4ZWN1dGUgZWFjaCBjaGlsZCByb3V0ZSB1bnRpbCBvbmUgb2YgdGhlbSByZXR1cm4gdGhlIHJlc3VsdFxuICAgIGNvbnN0IHJvdXRlID0gYXdhaXQgbmV4dCgpO1xuXG4gICAgLy8gUHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgdGl0bGUsIGRlc2NyaXB0aW9uIGV0Yy5cbiAgICByb3V0ZS50aXRsZSA9IGAke3JvdXRlLnRpdGxlIHx8ICdVbnRpdGxlZCBQYWdlJ31gO1xuICAgIHJvdXRlLmRlc2NyaXB0aW9uID0gcm91dGUuZGVzY3JpcHRpb24gfHwgJyc7XG5cbiAgICByZXR1cm4gcm91dGU7XG4gIH0sXG59O1xuXG4vLyBUaGUgZXJyb3IgcGFnZSBpcyBhdmFpbGFibGUgYnkgcGVybWFuZW50IHVybCBmb3IgZGV2ZWxvcG1lbnQgbW9kZVxuaWYgKF9fREVWX18pIHtcbiAgcm91dGVzLmNoaWxkcmVuLnVuc2hpZnQoe1xuICAgIHBhdGg6ICcvZXJyb3InLFxuICAgIGFjdGlvbjogcmVxdWlyZSgnLi9lcnJvcicpLmRlZmF1bHQsXG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL3JvdXRlcy9pbmRleC5qcyIsIi8qKlxuICogUmVhY3QgU3RhcnRlciBLaXQgKGh0dHBzOi8vd3d3LnJlYWN0c3RhcnRlcmtpdC5jb20vKVxuICpcbiAqIENvcHlyaWdodCDCqSAyMDE0LXByZXNlbnQgS3JpYXNvZnQsIExMQy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5pbXBvcnQgY29va2llUGFyc2VyIGZyb20gJ2Nvb2tpZS1wYXJzZXInO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IGV4cHJlc3NKd3QsIHsgVW5hdXRob3JpemVkRXJyb3IgYXMgSnd0NDAxRXJyb3IgfSBmcm9tICdleHByZXNzLWp3dCc7XG5pbXBvcnQgZXhwcmVzc0dyYXBoUUwgZnJvbSAnZXhwcmVzcy1ncmFwaHFsJztcbmltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcbmltcG9ydCBmZXRjaCBmcm9tICdub2RlLWZldGNoJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tL3NlcnZlcic7XG5pbXBvcnQgUHJldHR5RXJyb3IgZnJvbSAncHJldHR5LWVycm9yJztcbmltcG9ydCBBcHAgZnJvbSAnLi9jb21wb25lbnRzL0FwcCc7XG5pbXBvcnQgSHRtbCBmcm9tICcuL2NvbXBvbmVudHMvSHRtbCc7XG5pbXBvcnQgeyBFcnJvclBhZ2VXaXRob3V0U3R5bGUgfSBmcm9tICcuL3JvdXRlcy9lcnJvci9FcnJvclBhZ2UnO1xuaW1wb3J0IGVycm9yUGFnZVN0eWxlIGZyb20gJy4vcm91dGVzL2Vycm9yL0Vycm9yUGFnZS5jc3MnO1xuaW1wb3J0IGNyZWF0ZUZldGNoIGZyb20gJy4vY3JlYXRlRmV0Y2gnO1xuaW1wb3J0IHBhc3Nwb3J0IGZyb20gJy4vcGFzc3BvcnQnO1xuaW1wb3J0IHJvdXRlciBmcm9tICcuL3JvdXRlcic7XG5pbXBvcnQgbW9kZWxzIGZyb20gJy4vZGF0YS9tb2RlbHMnO1xuaW1wb3J0IHNjaGVtYSBmcm9tICcuL2RhdGEvc2NoZW1hJztcbmltcG9ydCBhc3NldHMgZnJvbSAnLi9hc3NldHMuanNvbic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLXVucmVzb2x2ZWRcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuXG5tb25nb29zZS5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcblxuLy8gQ29ubmVjdCB0byBNb25nb0RCXG5tb25nb29zZS5jb25uZWN0KGNvbmZpZy5tb25nby51cmksIGNvbmZpZy5tb25nby5vcHRpb25zKTtcbm1vbmdvb3NlLmNvbm5lY3Rpb24ub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgY29uc29sZS5lcnJvcihgTW9uZ29EQiBjb25uZWN0aW9uIGVycm9yOiAke2Vycn1gKTtcbiAgcHJvY2Vzcy5leGl0KC0xKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wcm9jZXNzLWV4aXRcbn0pO1xuXG5jb25zdCBhcHAgPSBleHByZXNzKCk7XG5cbnJlcXVpcmUoJy4vYXBpJykuZGVmYXVsdChhcHApO1xuXG4vLyBhcHAucG9zdCgnL2ZpbGVzJywgdXBsb2FkLnNpbmdsZSgnZmlsZScpLCAocmVxLCByZXMpID0+IHtcbi8vICAgY29uc3QgZmlsZSA9IHJlcS5maWxlOyAvLyBmaWxlIHBhc3NlZCBmcm9tIGNsaWVudFxuLy8gICBjb25zdCBtZXRhID0gcmVxLmJvZHk7IC8vIGFsbCBvdGhlciB2YWx1ZXMgcGFzc2VkIGZyb20gdGhlIGNsaWVudCwgbGlrZSBuYW1lLCBldGMuLlxuLy8gICBjb25zb2xlLmxvZyhmaWxlKTtcbi8vICAgcmVzLnNlbmQoMjAwKTtcbi8vIH0pO1xuLy9cbi8vIFRlbGwgYW55IENTUyB0b29saW5nIChzdWNoIGFzIE1hdGVyaWFsIFVJKSB0byB1c2UgYWxsIHZlbmRvciBwcmVmaXhlcyBpZiB0aGVcbi8vIHVzZXIgYWdlbnQgaXMgbm90IGtub3duLlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmdsb2JhbC5uYXZpZ2F0b3IgPSBnbG9iYWwubmF2aWdhdG9yIHx8IHt9O1xuZ2xvYmFsLm5hdmlnYXRvci51c2VyQWdlbnQgPSBnbG9iYWwubmF2aWdhdG9yLnVzZXJBZ2VudCB8fCAnYWxsJztcblxuLy9cbi8vIFJlZ2lzdGVyIE5vZGUuanMgbWlkZGxld2FyZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmFwcC51c2UoZXhwcmVzcy5zdGF0aWMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3B1YmxpYycpKSk7XG5hcHAudXNlKGNvb2tpZVBhcnNlcigpKTtcbmFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IHRydWUgfSkpO1xuYXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSk7XG5cbi8vXG4vLyBBdXRoZW50aWNhdGlvblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmFwcC51c2UoXG4gIGV4cHJlc3NKd3Qoe1xuICAgIHNlY3JldDogY29uZmlnLmF1dGguand0LnNlY3JldCxcbiAgICBjcmVkZW50aWFsc1JlcXVpcmVkOiBmYWxzZSxcbiAgICBnZXRUb2tlbjogcmVxID0+IHJlcS5jb29raWVzLmlkX3Rva2VuLFxuICB9KSxcbik7XG4vLyBFcnJvciBoYW5kbGVyIGZvciBleHByZXNzLWp3dFxuYXBwLnVzZSgoZXJyLCByZXEsIHJlcywgbmV4dCkgPT4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIGlmIChlcnIgaW5zdGFuY2VvZiBKd3Q0MDFFcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1tleHByZXNzLWp3dC1lcnJvcl0nLCByZXEuY29va2llcy5pZF90b2tlbik7XG4gICAgLy8gYGNsZWFyQ29va2llYCwgb3RoZXJ3aXNlIHVzZXIgY2FuJ3QgdXNlIHdlYi1hcHAgdW50aWwgY29va2llIGV4cGlyZXNcbiAgICByZXMuY2xlYXJDb29raWUoJ2lkX3Rva2VuJyk7XG4gIH1cbiAgbmV4dChlcnIpO1xufSk7XG5cbmFwcC51c2UocGFzc3BvcnQuaW5pdGlhbGl6ZSgpKTtcblxuaWYgKF9fREVWX18pIHtcbiAgYXBwLmVuYWJsZSgndHJ1c3QgcHJveHknKTtcbn1cbmFwcC5nZXQoXG4gICcvbG9naW4vZmFjZWJvb2snLFxuICBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2ZhY2Vib29rJywge1xuICAgIHNjb3BlOiBbJ2VtYWlsJywgJ3VzZXJfbG9jYXRpb24nXSxcbiAgICBzZXNzaW9uOiBmYWxzZSxcbiAgfSksXG4pO1xuYXBwLmdldChcbiAgJy9sb2dpbi9mYWNlYm9vay9yZXR1cm4nLFxuICBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2ZhY2Vib29rJywge1xuICAgIGZhaWx1cmVSZWRpcmVjdDogJy9sb2dpbicsXG4gICAgc2Vzc2lvbjogZmFsc2UsXG4gIH0pLFxuICAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBleHBpcmVzSW4gPSA2MCAqIDYwICogMjQgKiAxODA7IC8vIDE4MCBkYXlzXG4gICAgY29uc3QgdG9rZW4gPSBqd3Quc2lnbihyZXEudXNlciwgY29uZmlnLmF1dGguand0LnNlY3JldCwgeyBleHBpcmVzSW4gfSk7XG4gICAgcmVzLmNvb2tpZSgnaWRfdG9rZW4nLCB0b2tlbiwgeyBtYXhBZ2U6IDEwMDAgKiBleHBpcmVzSW4sIGh0dHBPbmx5OiB0cnVlIH0pO1xuICAgIHJlcy5yZWRpcmVjdCgnLycpO1xuICB9LFxuKTtcblxuLy9cbi8vIFJlZ2lzdGVyIEFQSSBtaWRkbGV3YXJlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuYXBwLnVzZShcbiAgJy9ncmFwaHFsJyxcbiAgZXhwcmVzc0dyYXBoUUwocmVxID0+ICh7XG4gICAgc2NoZW1hLFxuICAgIGdyYXBoaXFsOiB0cnVlLFxuICAgIHJvb3RWYWx1ZTogeyByZXF1ZXN0OiByZXEgfSxcbiAgICBwcmV0dHk6IF9fREVWX18sXG4gIH0pKSxcbik7XG5cbi8vXG4vLyBSZWdpc3RlciBzZXJ2ZXItc2lkZSByZW5kZXJpbmcgbWlkZGxld2FyZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmFwcC5nZXQoJyonLCBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjc3MgPSBuZXcgU2V0KCk7XG5cbiAgICAvLyBHbG9iYWwgKGNvbnRleHQpIHZhcmlhYmxlcyB0aGF0IGNhbiBiZSBlYXNpbHkgYWNjZXNzZWQgZnJvbSBhbnkgUmVhY3QgY29tcG9uZW50XG4gICAgLy8gaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy9jb250ZXh0Lmh0bWxcbiAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgLy8gRW5hYmxlcyBjcml0aWNhbCBwYXRoIENTUyByZW5kZXJpbmdcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlhc29mdC9pc29tb3JwaGljLXN0eWxlLWxvYWRlclxuICAgICAgaW5zZXJ0Q3NzOiAoLi4uc3R5bGVzKSA9PiB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlcnNjb3JlLWRhbmdsZVxuICAgICAgICBzdHlsZXMuZm9yRWFjaChzdHlsZSA9PiBjc3MuYWRkKHN0eWxlLl9nZXRDc3MoKSkpO1xuICAgICAgfSxcbiAgICAgIC8vIFVuaXZlcnNhbCBIVFRQIGNsaWVudFxuICAgICAgZmV0Y2g6IGNyZWF0ZUZldGNoKGZldGNoLCB7XG4gICAgICAgIGJhc2VVcmw6IGNvbmZpZy5hcGkuc2VydmVyVXJsLFxuICAgICAgICBjb29raWU6IHJlcS5oZWFkZXJzLmNvb2tpZSxcbiAgICAgIH0pLFxuICAgIH07XG5cbiAgICBjb25zdCByb3V0ZSA9IGF3YWl0IHJvdXRlci5yZXNvbHZlKHtcbiAgICAgIC4uLmNvbnRleHQsXG4gICAgICBwYXRoOiByZXEucGF0aCxcbiAgICAgIHF1ZXJ5OiByZXEucXVlcnksXG4gICAgfSk7XG5cbiAgICBpZiAocm91dGUucmVkaXJlY3QpIHtcbiAgICAgIHJlcy5yZWRpcmVjdChyb3V0ZS5zdGF0dXMgfHwgMzAyLCByb3V0ZS5yZWRpcmVjdCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHsgLi4ucm91dGUgfTtcbiAgICBkYXRhLmNoaWxkcmVuID0gUmVhY3RET00ucmVuZGVyVG9TdHJpbmcoXG4gICAgICA8QXBwIGNvbnRleHQ9e2NvbnRleHR9PlxuICAgICAgICB7cm91dGUuY29tcG9uZW50fVxuICAgICAgPC9BcHA+LFxuICAgICk7XG4gICAgZGF0YS5zdHlsZXMgPSBbeyBpZDogJ2NzcycsIGNzc1RleHQ6IFsuLi5jc3NdLmpvaW4oJycpIH1dO1xuICAgIGRhdGEuc2NyaXB0cyA9IFthc3NldHMudmVuZG9yLmpzXTtcbiAgICBpZiAocm91dGUuY2h1bmtzKSB7XG4gICAgICBkYXRhLnNjcmlwdHMucHVzaCguLi5yb3V0ZS5jaHVua3MubWFwKGNodW5rID0+IGFzc2V0c1tjaHVua10uanMpKTtcbiAgICB9XG4gICAgZGF0YS5zY3JpcHRzLnB1c2goYXNzZXRzLmNsaWVudC5qcyk7XG4gICAgZGF0YS5hcHAgPSB7XG4gICAgICBhcGlVcmw6IGNvbmZpZy5hcGkuY2xpZW50VXJsLFxuICAgIH07XG5cbiAgICBjb25zdCBodG1sID0gUmVhY3RET00ucmVuZGVyVG9TdGF0aWNNYXJrdXAoPEh0bWwgey4uLmRhdGF9IC8+KTtcbiAgICByZXMuc3RhdHVzKHJvdXRlLnN0YXR1cyB8fCAyMDApO1xuICAgIHJlcy5zZW5kKGA8IWRvY3R5cGUgaHRtbD4ke2h0bWx9YCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIG5leHQoZXJyKTtcbiAgfVxufSk7XG5cbi8vXG4vLyBFcnJvciBoYW5kbGluZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IHBlID0gbmV3IFByZXR0eUVycm9yKCk7XG5wZS5za2lwTm9kZUZpbGVzKCk7XG5wZS5za2lwUGFja2FnZSgnZXhwcmVzcycpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbmFwcC51c2UoKGVyciwgcmVxLCByZXMsIG5leHQpID0+IHtcbiAgY29uc29sZS5lcnJvcihwZS5yZW5kZXIoZXJyKSk7XG4gIGNvbnN0IGh0bWwgPSBSZWFjdERPTS5yZW5kZXJUb1N0YXRpY01hcmt1cChcbiAgICA8SHRtbFxuICAgICAgdGl0bGU9XCJJbnRlcm5hbCBTZXJ2ZXIgRXJyb3JcIlxuICAgICAgZGVzY3JpcHRpb249e2Vyci5tZXNzYWdlfVxuICAgICAgc3R5bGVzPXtbeyBpZDogJ2NzcycsIGNzc1RleHQ6IGVycm9yUGFnZVN0eWxlLl9nZXRDc3MoKSB9XX0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlcnNjb3JlLWRhbmdsZVxuICAgID5cbiAgICAgIHtSZWFjdERPTS5yZW5kZXJUb1N0cmluZyg8RXJyb3JQYWdlV2l0aG91dFN0eWxlIGVycm9yPXtlcnJ9IC8+KX1cbiAgICA8L0h0bWw+LFxuICApO1xuICByZXMuc3RhdHVzKGVyci5zdGF0dXMgfHwgNTAwKTtcbiAgcmVzLnNlbmQoYDwhZG9jdHlwZSBodG1sPiR7aHRtbH1gKTtcbn0pO1xuXG4vL1xuLy8gTGF1bmNoIHRoZSBzZXJ2ZXJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBwcm9taXNlID0gbW9kZWxzLnN5bmMoKS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbmlmICghbW9kdWxlLmhvdCkge1xuICBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgIGFwcC5saXN0ZW4oY29uZmlnLnBvcnQsICgpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbyhgVGhlIHNlcnZlciBpcyBydW5uaW5nIGF0IGh0dHA6Ly9sb2NhbGhvc3Q6JHtjb25maWcucG9ydH0vYCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vL1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmlmIChtb2R1bGUuaG90KSB7XG4gIGFwcC5ob3QgPSBtb2R1bGUuaG90O1xuICBtb2R1bGUuaG90LmFjY2VwdCgnLi9yb3V0ZXInKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXBwO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9zZXJ2ZXIuanMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImF4aW9zXCJcbi8vIG1vZHVsZSBpZCA9IGF4aW9zXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhYmVsLXBvbHlmaWxsXCJcbi8vIG1vZHVsZSBpZCA9IGJhYmVsLXBvbHlmaWxsXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnlcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnlcIlxuLy8gbW9kdWxlIGlkID0gYmFiZWwtcnVudGltZS9jb3JlLWpzL2pzb24vc3RyaW5naWZ5XG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5XCJcbi8vIG1vZHVsZSBpZCA9IGJhYmVsLXJ1bnRpbWUvaGVscGVycy9zbGljZWRUb0FycmF5XG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJsdWViaXJkXCJcbi8vIG1vZHVsZSBpZCA9IGJsdWViaXJkXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJib2R5LXBhcnNlclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJvZHktcGFyc2VyXCJcbi8vIG1vZHVsZSBpZCA9IGJvZHktcGFyc2VyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiY2xhc3NuYW1lc1wiXG4vLyBtb2R1bGUgaWQgPSBjbGFzc25hbWVzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb29raWUtcGFyc2VyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiY29va2llLXBhcnNlclwiXG4vLyBtb2R1bGUgaWQgPSBjb29raWUtcGFyc2VyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjc3YtZmlsZS1jcmVhdG9yXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiY3N2LWZpbGUtY3JlYXRvclwiXG4vLyBtb2R1bGUgaWQgPSBjc3YtZmlsZS1jcmVhdG9yXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjc3Zqc29uXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiY3N2anNvblwiXG4vLyBtb2R1bGUgaWQgPSBjc3Zqc29uXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZXhwcmVzc1wiXG4vLyBtb2R1bGUgaWQgPSBleHByZXNzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzLWdyYXBocWxcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJleHByZXNzLWdyYXBocWxcIlxuLy8gbW9kdWxlIGlkID0gZXhwcmVzcy1ncmFwaHFsXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzLWp3dFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImV4cHJlc3Mtand0XCJcbi8vIG1vZHVsZSBpZCA9IGV4cHJlc3Mtand0XG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImZzXCJcbi8vIG1vZHVsZSBpZCA9IGZzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncmFwaHFsXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZ3JhcGhxbFwiXG4vLyBtb2R1bGUgaWQgPSBncmFwaHFsXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoaXN0b3J5L2NyZWF0ZUJyb3dzZXJIaXN0b3J5XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiaGlzdG9yeS9jcmVhdGVCcm93c2VySGlzdG9yeVwiXG4vLyBtb2R1bGUgaWQgPSBoaXN0b3J5L2NyZWF0ZUJyb3dzZXJIaXN0b3J5XG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJpc29tb3JwaGljLWZldGNoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiaXNvbW9ycGhpYy1mZXRjaFwiXG4vLyBtb2R1bGUgaWQgPSBpc29tb3JwaGljLWZldGNoXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJpc29tb3JwaGljLXN0eWxlLWxvYWRlci9saWIvd2l0aFN0eWxlc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImlzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi93aXRoU3R5bGVzXCJcbi8vIG1vZHVsZSBpZCA9IGlzb21vcnBoaWMtc3R5bGUtbG9hZGVyL2xpYi93aXRoU3R5bGVzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJqc29ud2VidG9rZW5cIlxuLy8gbW9kdWxlIGlkID0ganNvbndlYnRva2VuXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc3BkZlwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImpzcGRmXCJcbi8vIG1vZHVsZSBpZCA9IGpzcGRmXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9EYXRlUGlja2VyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibWF0ZXJpYWwtdWkvRGF0ZVBpY2tlclwiXG4vLyBtb2R1bGUgaWQgPSBtYXRlcmlhbC11aS9EYXRlUGlja2VyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9EaWFsb2dcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJtYXRlcmlhbC11aS9EaWFsb2dcIlxuLy8gbW9kdWxlIGlkID0gbWF0ZXJpYWwtdWkvRGlhbG9nXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9EcmF3ZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJtYXRlcmlhbC11aS9EcmF3ZXJcIlxuLy8gbW9kdWxlIGlkID0gbWF0ZXJpYWwtdWkvRHJhd2VyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9GbGF0QnV0dG9uXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibWF0ZXJpYWwtdWkvRmxhdEJ1dHRvblwiXG4vLyBtb2R1bGUgaWQgPSBtYXRlcmlhbC11aS9GbGF0QnV0dG9uXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9MaXN0XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibWF0ZXJpYWwtdWkvTGlzdFwiXG4vLyBtb2R1bGUgaWQgPSBtYXRlcmlhbC11aS9MaXN0XG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9NZW51SXRlbVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcIm1hdGVyaWFsLXVpL01lbnVJdGVtXCJcbi8vIG1vZHVsZSBpZCA9IG1hdGVyaWFsLXVpL01lbnVJdGVtXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9SZWZyZXNoSW5kaWNhdG9yXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibWF0ZXJpYWwtdWkvUmVmcmVzaEluZGljYXRvclwiXG4vLyBtb2R1bGUgaWQgPSBtYXRlcmlhbC11aS9SZWZyZXNoSW5kaWNhdG9yXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9TZWxlY3RGaWVsZFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcIm1hdGVyaWFsLXVpL1NlbGVjdEZpZWxkXCJcbi8vIG1vZHVsZSBpZCA9IG1hdGVyaWFsLXVpL1NlbGVjdEZpZWxkXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9UYWJsZVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcIm1hdGVyaWFsLXVpL1RhYmxlXCJcbi8vIG1vZHVsZSBpZCA9IG1hdGVyaWFsLXVpL1RhYmxlXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9UZXh0RmllbGRcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJtYXRlcmlhbC11aS9UZXh0RmllbGRcIlxuLy8gbW9kdWxlIGlkID0gbWF0ZXJpYWwtdWkvVGV4dEZpZWxkXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9zdHlsZXMvTXVpVGhlbWVQcm92aWRlclwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcIm1hdGVyaWFsLXVpL3N0eWxlcy9NdWlUaGVtZVByb3ZpZGVyXCJcbi8vIG1vZHVsZSBpZCA9IG1hdGVyaWFsLXVpL3N0eWxlcy9NdWlUaGVtZVByb3ZpZGVyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9zdHlsZXMvYmFzZVRoZW1lcy9saWdodEJhc2VUaGVtZVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcIm1hdGVyaWFsLXVpL3N0eWxlcy9iYXNlVGhlbWVzL2xpZ2h0QmFzZVRoZW1lXCJcbi8vIG1vZHVsZSBpZCA9IG1hdGVyaWFsLXVpL3N0eWxlcy9iYXNlVGhlbWVzL2xpZ2h0QmFzZVRoZW1lXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtYXRlcmlhbC11aS9zdHlsZXMvZ2V0TXVpVGhlbWVcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJtYXRlcmlhbC11aS9zdHlsZXMvZ2V0TXVpVGhlbWVcIlxuLy8gbW9kdWxlIGlkID0gbWF0ZXJpYWwtdWkvc3R5bGVzL2dldE11aVRoZW1lXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb25nb29zZVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcIm1vbmdvb3NlXCJcbi8vIG1vZHVsZSBpZCA9IG1vbmdvb3NlXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtdWx0ZXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJtdWx0ZXJcIlxuLy8gbW9kdWxlIGlkID0gbXVsdGVyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJub2RlLWZldGNoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibm9kZS1mZXRjaFwiXG4vLyBtb2R1bGUgaWQgPSBub2RlLWZldGNoXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXNzcG9ydFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhc3Nwb3J0XCJcbi8vIG1vZHVsZSBpZCA9IHBhc3Nwb3J0XG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXNzcG9ydC1mYWNlYm9va1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhc3Nwb3J0LWZhY2Vib29rXCJcbi8vIG1vZHVsZSBpZCA9IHBhc3Nwb3J0LWZhY2Vib29rXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicGF0aFwiXG4vLyBtb2R1bGUgaWQgPSBwYXRoXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwaGFudG9tXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicGhhbnRvbVwiXG4vLyBtb2R1bGUgaWQgPSBwaGFudG9tXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwcmV0dHktZXJyb3JcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJwcmV0dHktZXJyb3JcIlxuLy8gbW9kdWxlIGlkID0gcHJldHR5LWVycm9yXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwcm9wLXR5cGVzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicHJvcC10eXBlc1wiXG4vLyBtb2R1bGUgaWQgPSBwcm9wLXR5cGVzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlYWN0XCJcbi8vIG1vZHVsZSBpZCA9IHJlYWN0XG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1kb20vc2VydmVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVhY3QtZG9tL3NlcnZlclwiXG4vLyBtb2R1bGUgaWQgPSByZWFjdC1kb20vc2VydmVyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1maWxlLWRvd25sb2FkXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVhY3QtZmlsZS1kb3dubG9hZFwiXG4vLyBtb2R1bGUgaWQgPSByZWFjdC1maWxlLWRvd25sb2FkXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWNoYXJ0c1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlY2hhcnRzXCJcbi8vIG1vZHVsZSBpZCA9IHJlY2hhcnRzXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzZXF1ZWxpemVcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJzZXF1ZWxpemVcIlxuLy8gbW9kdWxlIGlkID0gc2VxdWVsaXplXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzZXJpYWxpemUtamF2YXNjcmlwdFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInNlcmlhbGl6ZS1qYXZhc2NyaXB0XCJcbi8vIG1vZHVsZSBpZCA9IHNlcmlhbGl6ZS1qYXZhc2NyaXB0XG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1bml2ZXJzYWwtcm91dGVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidW5pdmVyc2FsLXJvdXRlclwiXG4vLyBtb2R1bGUgaWQgPSB1bml2ZXJzYWwtcm91dGVyXG4vLyBtb2R1bGUgY2h1bmtzID0gMTQiXSwibWFwcGluZ3MiOiI7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7O0FDdHNCQTs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7Ozs7Ozs7O0FDM0JBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaEJBO0FBQ0E7QUFrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQ0E7QUFNQTtBQUNBOzs7Ozs7OztBQzlCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQU9BO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVdBO0FBU0E7QUFDQTtBQUNBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7Ozs7Ozs7QUMvVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNQQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBakJBO0FBQ0E7QUFtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQ0E7QUFNQTtBQUNBOzs7Ozs7OztBQy9CQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBOzs7Ozs7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNMQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBSUE7QUFJQTtBQUlBO0FBSUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTs7Ozs7Ozs7QUN0REE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BOzs7Ozs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDTkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBOzs7Ozs7O0FDL1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNMQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBOzs7Ozs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ05BO0FBQUE7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBQ0E7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQVNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDdkNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7OztBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQURBO0FBR0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUlBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBR0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBOzs7Ozs7OztBQy9ZQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhCQTtBQUNBO0FBa0JBO0FBQ0E7Ozs7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDTkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFRQTtBQU1BO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVNBO0FBT0E7QUFDQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7Ozs7Ozs7QUN6TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNQQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBbkNBO0FBNkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVVBO0FBQ0E7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUhBO0FBYUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUhBO0FBYUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUhBO0FBYUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUhBO0FBYUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUhBO0FBbkRBO0FBaUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWUE7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQVVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7Ozs7Ozs7QUM1ZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ3BCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNuRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBQ0E7QUFhQTtBQUNBOzs7Ozs7OztBQ2xCQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkE7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhCQTtBQUNBO0FBREE7QUFFQTtBQUNBO0FBRkE7QUFEQTtBQW1CQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW1CQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUhBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVhBO0FBa0JBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFEQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFEQTtBQURBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVBO0FBRUE7QUFDQTtBQUNBO0FBSEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBbEJBO0FBbkJBO0FBOENBO0FBckVBO0FBQ0E7QUFEQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFDQTtBQVhBO0FBREE7QUFnQkE7QUFDQTtBQUZBO0FBeURBOzs7Ozs7O0FDM0ZBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFHQTtBQUpBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBbkJBO0FBN0JBOzs7Ozs7Ozs7O0FDQ0E7Ozs7OztBQWxCQTs7Ozs7Ozs7O0FBd0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSkE7QUFDQTtBQVVBO0FBS0E7QUFIQTtBQVNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNsREE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBWkE7QUFrQkE7QUFEQTtBQUNBO0FBSUE7Ozs7Ozs7O0FDcENBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQURBO0FBTEE7QUFDQTtBQVNBOzs7Ozs7OztBQ3RCQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFOQTtBQUNBO0FBV0E7Ozs7Ozs7O0FDeEJBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQXRCQTtBQUNBO0FBMEJBOzs7Ozs7OztBQ3ZDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDeENBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBTkE7QUFPQTtBQWJBO0FBQ0E7QUFlQTs7Ozs7Ozs7Ozs7Ozs7QUN6QkE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFOQTtBQU9BO0FBYkE7QUFDQTtBQWVBOzs7Ozs7OztBQ3pCQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFLQTtBQVRBO0FBQ0E7QUFXQTs7Ozs7Ozs7QUN2QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaENBO0FBQ0E7QUFrQ0E7Ozs7Ozs7O0FDekRBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUZBO0FBREE7QUFDQTtBQVdBOzs7Ozs7OztBQy9CQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBQ0E7QUFLQTs7Ozs7Ozs7QUNsQkE7QUFBQTtBQUFBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZEE7QUFGQTtBQUNBO0FBbUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUZBO0FBQ0E7QUFPQTs7Ozs7Ozs7QUNuQ0E7QUFBQTtBQUFBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFmQTtBQUZBO0FBQ0E7QUFvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBRkE7QUFDQTtBQU9BOzs7Ozs7OztBQ3BDQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFGQTtBQUNBO0FBVUE7Ozs7Ozs7O0FDMUJBO0FBQUE7QUFBQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUZBO0FBQ0E7QUFPQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4QkE7Ozs7Ozs7OztBQVNBOzs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFRQTtBQVpBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFMQTtBQVlBO0FBREE7QUFRQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFKQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBTEE7QUFZQTtBQURBO0FBUUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBekZBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUF5RkE7QUFDQTtBQUNBO0FBR0E7Ozs7Ozs7O0FDMUlBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdCQTs7Ozs7Ozs7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFGQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUZBO0FBS0E7QUE3QkE7QUFDQTtBQURBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQURBO0FBREE7QUFVQTtBQURBO0FBdUJBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMvQ0E7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNuQkE7Ozs7Ozs7OztBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBRUE7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUVBO0FBQ0E7QUFGQTtBQU1BO0FBQ0E7QUFGQTtBQVJBO0FBZ0JBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFNQTtBQUNBO0FBRkE7QUFSQTtBQWdCQTtBQUNBO0FBRUE7QUFDQTtBQUZBO0FBTUE7QUFDQTtBQUZBO0FBUkE7QUF6Q0E7QUEyREE7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUVBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQU1BO0FBQ0E7QUFGQTtBQU1BO0FBQ0E7QUFGQTtBQWpCQTtBQXlCQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUtBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFTQTtBQWhJQTtBQUNBO0FBa0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkpBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBSEE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUZBO0FBS0E7QUFHQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQVJBO0FBQ0E7QUFhQTtBQUVBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdERBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFMQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDcE9BOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7Ozs7O0FDQUE7Ozs7Ozs7QUNBQTs7Ozs7OztBQ0FBOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=