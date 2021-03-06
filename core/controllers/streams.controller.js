var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var path = require('path');
var _ = require('lodash');
var async = require('async');
var exec = require('child_process').exec;
var logger = require('../../lib/logger.lib');
var localStorage = require('../../lib/localStorage.lib');
var networkService = require('../services/network.service');
var streamService = require('../services/stream.service');
var switchStates = false;

/**
 * CMD
 * @param {Array} option
 * @return {Array} cmd
 */
function createCMD (option) {
  var reg = /^(\w+)\:\/\//;

  option = option || {};

  var pre = _.get(_.get(option, 'url', '').match(reg), [1]);

  var startCMD = [];

  if (pre === 'rtsp') {
    startCMD = ['-rtsp_transport', 'tcp', '-i'];
  } else {
    startCMD = ['-i'];
  }

  var normal = [];

  if (option.inNetwork) {
    normal = startCMD.concat([option.url + '?source=' + option.inNetwork]);
  } else {
    normal = startCMD.concat(['-i', option.url]);
  }

  var cmd = [];

  if (option.muhicast && !option.hls) {
    cmd = ['ffmpeg', normal.concat(['-vcodec', 'copy', '-acodec', 'copy', '-f', 'mpegts', option.outUrl + '?localaddr=' + option.address + '&pkt_size=1316&buffer_size=65535'])];
  } else if (!option.muhicast && option.hls) {
    cmd = ['ffmpeg', normal.concat(['-vcodec', 'copy', '-acodec', 'copy', '-f', 'hls', '-hls_list_size', '5', '-hls_wrap', '5', '-hls_time', '10', path.join(__dirname, '../../public/assets/streams/' + option.name  + '/1.m3u8')])];
  } else if (option.muhicast && option.hls) {
    cmd = ['ffmpeg', normal.concat(['-vcodec', 'copy', '-acodec', 'copy', '-f', 'hls', '-hls_list_size', '5', '-hls_wrap', '5', '-hls_time', '10', path.join(__dirname, '../../public/assets/streams/' + option.name  + '/1.m3u8'), '-vcodec', 'copy', '-acodec', 'copy', '-f', 'mpegts', option.outUrl + '?localaddr=' + option.address + '&pkt_size=1316&buffer_size=65535'])];
  } else if (!option.muhicast && !option.hls) {
    cmd = null;
  }

  return cmd;
}

/**
 * 转码信息
 * @param {Object} req
 *        {Object} req.body.id
 * @param {Object} res
 */
exports.one = function (req, res) {
  req.checkParams({
    'id': {
      notEmpty: {
        options: [true],
        errorMessage: 'id 不能为空'
      }
    }
  });

  if (req.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', req.validationErrors());
    return res.status(400).end();
  }

  var id = req.params.id;

  var streams = localStorage.getItem('streams');

  if (!streams) {
    return res.status(200).json([]);
  }

  var stream = JSON.parse(streams);
  var item = _.find(stream, { id: id });

  res.status(200).json(item);
};

/**
 * 转码列表
 * @param {Object} req
 * @param {Object} res
 */
exports.list = function (req, res) {
  var streams = localStorage.getItem('streams');

  if (!streams) {
    return res.status(200).json([]);
  }

  var streamList = _.sortBy(JSON.parse(streams), 'id');

  res.status(200).json(streamList);
};

/**
 * 开关
 * @param {Object} req
 *        {String} req.body.id
 *        {String} req.body.active
 * @param {Object} res
 */
exports.switch = function (req, res) {
  req.checkBody({
    'id': {
      notEmpty: {
        options: [true],
        errorMessage: 'id 不能为空'
      },
      isString: { errorMessage: 'id 需为字符串' }
    },
    'active': {
      notEmpty: {
        options: [true],
        errorMessage: 'active 不能为空'
      },
      isBoolean: { errorMessage: 'active 需为 boolean' }
    }
  });

  if (req.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', req.validationErrors());
    return res.status(400).end();
  }

  var streams = localStorage.getItem('streams');

  if (!streams) streams = [];

  var streamList = JSON.parse(streams);

  var result = _.find(streamList, { id: req.body.id });

  _.pull(streamList, result);

  var _pid = result.pid;

  if (!req.body.active) {
    result.pid = '';
  }

  streamList.push(result);

  localStorage.setItem('streams', JSON.stringify(streamList));

  if (req.body.active) {
    streamService.runCMD(result.id, result.cmd);
  } else {
    exec('kill ' + _pid);
  }

  res.status(204).end();
};

/**
 * 创建转码
 * @param {Object} req
 *        {String} req.body.name
 *        {String} req.body.url
 * @param {Object} res
 */
exports.create = function (req, res) {
  req.checkBody({
    'name': {
      notEmpty: {
        options: [true],
        errorMessage: 'name 不能为空'
      },
      isString: { errorMessage: 'name 需为字符串' }
    },
    'url': {
      notEmpty: {
        options: [true],
        errorMessage: 'url 不能为空'
      },
      isString: { errorMessage: 'url 需为字符串' }
    }
  });

  if (req.body.inNetwork) {
    req.checkBody({
      'inNetwork': {
        isString: { errorMessage: 'inNetwork 需为字符串' }
      }
    });
  }

  if (req.body.hls) {
    req.checkBody({
      'hls': {
        isBoolean: { errorMessage: 'hls 需为Boolean' }
      }
    });
  }

  if (req.body.muhicast) {
    req.checkBody({
      'muhicast': {
        isBoolean: { errorMessage: 'muhicast 需为Boolean' }
      },
      'network': {
        notEmpty: {
          options: [true],
          errorMessage: 'network 不能为空'
        },
        isString: { errorMessage: 'network 需为字符串' }
      },
      'outUrl': {
        notEmpty: {
          options: [true],
          errorMessage: 'outUrl 不能为空'
        },
        isString: { errorMessage: 'outUrl 需为字符串' }
      }
    });
  }

  if (req.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', req.validationErrors() );
    return res.status(400).end();
  }

  var stream = {
    name: req.body.name,
    url: req.body.url
  };

  if (req.body.inNetwork) {
    stream.inNetwork = req.body.inNetwork;
  }

  if (req.body.hls) {
    stream.hls = true;
  }

  if (req.body.muhicast) {
    stream.muhicast = true;
    stream.network = req.body.network;
    stream.outUrl = req.body.outUrl;
  }

  async.auto({
    mkdir: function (callback) {
      mkdirp(path.join(__dirname, '../../public/assets/streams/' + stream.name), function (err) {
        if (err) err.type = 'system';

        callback(err);
      });
    },
    getNetwork: function (callback) {
      if (!stream.network) {
        callback();
        return false;
      }

      networkService.one(stream.network, function (err, result) {
        if (err) err.type = 'system';

        callback(err, result);
      });
    },
    createCMD: ['mkdir', 'getNetwork', function (callback, results) {
      var cmd = createCMD({
        inNetwork: _.get(stream, 'inNetwork', ''),
        url: _.get(stream, 'url', ''),
        muhicast: _.get(stream, 'muhicast', ''),
        hls: _.get(stream, 'hls', ''),
        outUrl: _.get(stream, 'outUrl', ''),
        address: _.get(results, 'getNetwork.address', ''),
        name: _.get(stream, 'name', '')
      });

      callback(null, cmd);
    }],
    writeData: ['createCMD',  function (callback, results) {
      var streams = localStorage.getItem('streams');

      var streamList;

      if (!streams || JSON.parse(streams).length === 0) {
        streamList = [];

        stream.id = '001';
      } else {
        streamList = JSON.parse(streams);

        var id = (Number(_.sortBy(streamList, 'id')[streamList.length - 1].id) + 1) + '';

        switch (id.length) {
          case 1:
            id = '00' + id;

            break;
          case 2:
            id = '0' + id;
        }

        stream.id = id;
      }

      if (results.createCMD) {
        stream.cmd = results.createCMD;
      } else {
        stream.cmd = '';
      }

      streamList.push(stream);

      localStorage.setItem('streams', JSON.stringify(streamList));

      callback(null, stream.id);
    }],
    runCMD: ['createCMD', 'writeData', function (callback, results) {
      if (!results.createCMD) {
        callback();
        return false;
      }

      streamService.runCMD(results.writeData, results.createCMD);

      callback();
    }]
  }, function (err, results) {
    if (err) {
      logger[err.type]().error(__filename, err.message, err);
      return res.status(500).end();
    }

    res.status(204).end();
  });
};

/**
 * 更新转码
 * @param {Object} req
 *        {MongoId} req.body.id
 * @param {Object} res
 */
exports.update = function (req, res) {
  req.checkBody({
    'name': {
      notEmpty: {
        options: [true],
        errorMessage: 'name 不能为空'
      },
      isString: { errorMessage: 'name 需为字符串' }
    },
    'url': {
      notEmpty: {
        options: [true],
        errorMessage: 'url 不能为空'
      },
      isString: { errorMessage: 'url 需为字符串' }
    }
  });

  if (req.body.inNetwork) {
    req.checkBody({
      'inNetwork': {
        isString: { errorMessage: 'inNetwork 需为字符串' }
      }
    });
  }

  if (req.body.hls) {
    req.checkBody({
      'hls': {
        isBoolean: { errorMessage: 'hls 需为Boolean' }
      }
    });
  }

  if (req.body.muhicast) {
    req.checkBody({
      'muhicast': {
        isBoolean: { errorMessage: 'muhicast 需为Boolean' }
      },
      'network': {
        notEmpty: {
          options: [true],
          errorMessage: 'network 不能为空'
        },
        isString: { errorMessage: 'network 需为字符串' }
      },
      'outUrl': {
        notEmpty: {
          options: [true],
          errorMessage: 'outUrl 不能为空'
        },
        isString: { errorMessage: 'outUrl 需为字符串' }
      }
    });
  }

  if (req.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', req.validationErrors());
    return res.status(400).end();
  }

  var id = req.params.id;

  var stream = {
    name: req.body.name,
    url: req.body.url
  };

  if (req.body.inNetwork) {
    stream.inNetwork = req.body.inNetwork;
  }

  if (req.body.hls) {
    stream.hls = true;
  }

  if (req.body.muhicast) {
    stream.muhicast = true;
    stream.network = req.body.network;
    stream.outUrl = req.body.outUrl;
  }

  async.auto({
    loadStreams: function (callback) {
      var streams = localStorage.getItem('streams');

      if (!streams) streams = [];

      var streamsList = JSON.parse(streams);

      var oldStream = _.find(streamsList, { id: id });

      if (oldStream.pid) exec('kill ' + oldStream.pid);

      callback(null, {
        streamsList: streamsList,
        oldStream: oldStream
      })
    },
    checkDir: ['loadStreams', function (callback, results) {
      if (results.loadStreams.oldStream.name === stream.name) {
        callback();
        return false;
      }

      rimraf(path.join(__dirname, '../../public/assets/streams/' + results.loadStreams.oldStream.name), function (err) {
        if (err) {
          err.type = 'system';
          err.message = 'RM文件夹失败';
          callback(err);
          return false;
        }

        mkdirp(path.join(__dirname, '../../public/assets/streams/' + stream.name), function (err) {
          if (err) {
            err.type = 'system';
            err.message = 'MK文件夹失败';
            callback(err);
            return false;
          }

          callback();
        });
      });
    }],
    getNetwork: function (callback) {
      if (!stream.network) {
        callback();
        return false;
      }

      networkService.one(stream.network, function (err, result) {
        if (err) err.type = 'system';

        callback(err, result);
      });
    },
    createCMD: ['checkDir', 'getNetwork', function (callback, results) {
      var cmd = createCMD({
        inNetwork: stream.inNetwork || '',
        url: stream.url || '',
        muhicast: stream.muhicast || '',
        hls: stream.hls || '',
        outUrl: stream.outUrl || '',
        address: results.getNetwork.address || '',
        name: stream.name || ''
      });

      callback(null, cmd);
    }],
    writeData: ['createCMD',  function (callback, results) {
      var newStream = {
        id: results.loadStreams.oldStream.id
      };

      if (results.createCMD) {
        newStream.cmd = results.createCMD;
      } else {
        newStream.cmd = '';
      }

      newStream.name = stream.name;
      newStream.url = stream.url;

      if (req.body.inNetwork) {
        newStream.inNetwork = stream.inNetwork;
      }

      if (req.body.hls) {
        newStream.hls = stream.hls;
      }

      if (req.body.muhicast) {
        newStream.muhicast = stream.muhicast;
        newStream.network = stream.network;
        newStream.outUrl = stream.outUrl;
      }

      var newStreamList = results.loadStreams.streamsList;

      newStreamList = _.map(newStreamList, function (item) {
        if (item.id === id) {
          item = newStream;
        }

        return item;
      });

      localStorage.setItem('streams', JSON.stringify(newStreamList));

      callback();
    }],
    runCMD: ['writeData', function (callback, results) {
      if (!results.createCMD) {
        callback();
        return false;
      }

      streamService.runCMD(id, results.createCMD);

      callback();
    }]
  }, function (err, results) {
    if (err) {
      logger[err.type]().error(__filename, err.message, err);
      return res.status(500).end();
    }

    res.status(204).end();
  });
};

/**
 * 删除转码
 * @param {Object} req
 *        {MongoId} req.body.id
 * @param {Object} res
 */
exports.remove = function (req, res) {
  req.checkParams({
    'id': {
      notEmpty: {
        options: [true],
        errorMessage: 'id 不能为空'
      }
    }
  });

  if (req.validationErrors()) {
    logger.system().error(__filename, '参数验证失败', req.validationErrors());
    return res.status(400).end();
  }

  var streams = localStorage.getItem('streams');

  if (!streams) streams = [];

  var streamList = JSON.parse(streams);
  var oldStream = _.find(streamList, { id: req.params.id });
  var oldPid = _.get(oldStream, 'pid');
  var newStreamList = _.reject(streamList, { id: req.params.id });

  if (oldPid) exec('kill ' + oldPid);

  rimraf(path.join(__dirname, '../../public/assets/streams/' + oldStream.name), function (err) {
    if (err) {
      logger.system().error(__filename, '获取 Stream 失败', err);
      return res.status(400).end();
    }

    localStorage.setItem('streams', JSON.stringify(newStreamList));

    res.status(204).end();
  });
};
