angular.module("views").run(["$templateCache", function($templateCache) {$templateCache.put("channel-change.view.html","<div class=\"page-header clearfix\">\n    <ol ng-if=\"action === \'create\'\" class=\"heading\">\n        <li><a ui-sref=\"main.channel\">频道管理</a></li>\n        <li><a ui-sref=\"main.channel.create\">新增频道</a></li>\n    </ol>\n    <ol ng-if=\"action === \'update\'\" class=\"heading\">\n        <li><a ui-sref=\"main.channel\">频道管理</a></li>\n        <li><a ui-sref=\"main.channel.update({ _id: _id })\">更新频道</a></li>\n    </ol>\n</div>\n<div class=\"panel panel-default\">\n    <div class=\"panel-body\">\n        <form ng-submit=\"saveChannel()\" class=\"form-horizontal\" id=\"channelForm\" name=\"channelForm\" novalidate>\n            <div ng-class=\"{ \'has-error\': channelForm.url.$touched && channelForm.url.$invalid }\" class=\"form-group\">\n                <label for=\"url\" class=\"col-sm-2 control-label\">* 频道名称：</label>\n                <div class=\"col-sm-10\">\n                    <input ng-model=\"url\" ng-pattern=\"/^\\/\\w+$/\" ng-disabled=\"transmitting\" class=\"form-control\" id=\"url\" type=\"text\" name=\"url\" placeholder=\"请输入以 / 开头的频道名称，例如 /channel1\" required>\n                    <p ng-show=\"channelForm.url.$touched && channelForm.url.$invalid\" class=\"help-block\">频道名称需为以 / 开头的且为英文的名称</p>\n                </div>\n            </div>\n            <div ng-class=\"{ \'has-error\': channelForm.source.$touched && channelForm.source.$invalid }\" class=\"form-group\">\n                <label for=\"source\" class=\"col-sm-2 control-label\">* 源 URL：</label>\n                <div class=\"col-sm-10\">\n                    <input ng-model=\"source\" ng-disabled=\"transmitting\" class=\"form-control\" id=\"source\" type=\"text\" name=\"source\" placeholder=\"请输入源URL\" required>\n                    <!--<div class=\"checkbox\">-->\n                        <!--<label>-->\n                            <!--<input type=\"checkbox\"> 如果源格式为 RTMP，请勾选此项-->\n                        <!--</label>-->\n                    <!--</div>-->\n                </div>\n            </div>\n            <div ng-class=\"{ \'has-error\': channelForm.remark.$touched && channelForm.remark.$invalid }\" class=\"form-group\">\n                <label for=\"remark\" class=\"col-sm-2 control-label\">备注：</label>\n                <div class=\"col-sm-10\">\n                    <input ng-model=\"remark\" ng-disabled=\"transmitting\" class=\"form-control\" id=\"remark\" type=\"text\" name=\"remark\" placeholder=\"请输入备注\">\n                </div>\n            </div>\n        </form>\n    </div>\n</div>\n<button ng-disabled=\"transmitting || inputing || channelForm.$invalid\" class=\"btn btn-primary pull-right\" form=\"channelForm\" type=\"submit\"><i class=\"fa fa-save\"></i> 保存频道</button>");
$templateCache.put("channel.view.html","<!-- 删除模态 -->\n<div class=\"modal fade\" id=\"deleteModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"deleteModalTitle\" aria-hidden=\"true\">\n  <div class=\"modal-dialog modal-sm\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"关闭\"><span aria-hidden=\"true\">&times;</span></button>\n        <h4 class=\"modal-title\" id=\"deleteModalTitle\">警告</h4>\n      </div>\n      <div class=\"modal-body\">\n        <h4 class=\"text-center\">您确定要删除该频道？</h4>\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">取消</button>\n        <button ng-disabled=\"transmitting\" ng-click=\"deleteChannel()\" type=\"button\" class=\"btn btn-danger\">确认删除</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div ui-view class=\"view clearfix\">\n  <div class=\"page-header clearfix\">\n    <ol class=\"heading pull-left\">\n      <li><a ui-sref=\"main.channel\">频道管理</a></li>\n    </ol>\n    <a ui-sref=\"main.channel.create\" class=\"btn btn-primary btn-sm pull-right\"><i class=\"fa fa-pencil\"></i> 新增频道</a>\n  </div>\n  <div class=\"panel panel-default clear-bottom-margin\">\n    <div class=\"panel-body table-responsive\">\n      <table class=\"table table-hover\">\n        <thead class=\"text-center\">\n        <tr>\n          <th>频道ID</th>\n          <th>频道名称</th>\n          <th>源URL</th>\n          <th>备注</th>\n          <th>视频格式</th>\n          <th>操作</th>\n        </tr>\n        </thead>\n        <tbody class=\"text-center text-middle\">\n        <tr ng-repeat=\"item in channel\">\n          <td>{{item.name}}</td>\n          <td>{{item.url}}</td>\n          <td>{{item.source | words: 20}}</td>\n          <td></td>}}</td>\n          <td>{{item.remark}}</td>\n          <td>{{translate(item.source)}}</td>\n          <td>\n            <a ui-sref=\"main.channel.update({ _id: item.name })\" class=\"btn btn-default btn-xs\"><i class=\"fa fa-edit\"></i> 修改</a>\n            <button ng-click=\"$parent.$parent.deleteChannelId = item.name\" class=\"btn btn-default btn-xs\" type=\"button\" data-toggle=\"modal\" data-target=\"#deleteModal\"><i class=\"fa fa-trash-o\"></i> 删除</button>\n          </td>\n        </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>");
$templateCache.put("hardware.view.html","<div ui-view class=\"view clearfix\">\n  <div class=\"page-header clearfix\">\n    <ol class=\"heading\">\n      <li><a ui-sref=\"main.sites\">硬件信息</a></li>\n    </ol>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-8\">\n      <div class=\"panel panel-default\">\n        <div class=\"panel-body\">\n          <ul class=\"nav nav-pills\">\n            <li class=\"charNav\" ng-repeat=\"item in chartHeader\" ng-class=\"select === $index && \'active\'\" role=\"presentation\"><a ng-click=\"$parent.updateChart($index)\" href=\"#\">{{item}}</a></li>\n          </ul>\n        </div>\n      </div>\n      <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">上行带宽 kb/s</div>\n        <div class=\"panel-body\">\n          <canvas id=\"transmitChart\"></canvas>\n        </div>\n      </div>\n      <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">下行带宽 kb/s</div>\n        <div class=\"panel-body\">\n          <canvas id=\"receiveChart\"></canvas>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-md-4\">\n      <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">硬件使用率</div>\n        <div class=\"panel-body\">\n          <div class=\"row\">\n            <div class=\"col-xs-5 text-right\"><p><b>CPU：</b></p></div>\n            <div class=\"col-xs-7\">{{cpuUsage}}%</div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-xs-5 text-right\"><p><b>内存：</b></p></div>\n            <div class=\"col-xs-7\">{{memUsage}}%</div>\n          </div>\n        </div>\n      </div>\n      <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">硬件信息</div>\n        <div class=\"panel-body\">\n          <div class=\"row\">\n            <div class=\"col-xs-5 text-right\"><p><b>CPU型号：</b></p></div>\n            <div class=\"col-xs-7\">{{cpuModel}}</div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-xs-5 text-right\"><p><b>CPU核心数：</b></p></div>\n            <div class=\"col-xs-7\">{{cpuAmount}}</div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-xs-5 text-right\"><p><b>内存总量：</b></p></div>\n            <div class=\"col-xs-7\">{{memTotal}}</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>");
$templateCache.put("main.view.html","<nd-navigation></nd-navigation>\n<article ui-view class=\"page view clearfix\"></article>");
$templateCache.put("navigation.view.html","<!-- 注销模态 -->\n<div class=\"modal fade\" id=\"signOutModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"signOutModalTitle\" aria-hidden=\"true\">\n	<div class=\"modal-dialog modal-sm\">\n		<div class=\"modal-content\">\n			<div class=\"modal-header\">\n				<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"关闭\"><span aria-hidden=\"true\">&times;</span></button>\n				<h4 class=\"modal-title\" id=\"signOutModalTitle\">警告</h4>\n			</div>\n			<div class=\"modal-body\">\n				<h4 class=\"text-center\">您确定要退出登录吗？</h4>\n			</div>\n			<div class=\"modal-footer\">\n				<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">取消</button>\n				<button ng-click=\"signOut()\" type=\"button\" class=\"btn btn-danger\">退出</button>\n			</div>\n		</div>\n	</div>\n</div>\n\n<nav class=\"navigation\">\n	<div class=\"brand\">转码平台</div>\n	<div class=\"account\">\n		管理员 <div data-toggle=\"modal\" data-target=\"#signOutModal\" class=\"sign-out\"><i class=\"fa fa-sign-out\"></i></div>\n	</div>\n	<ul class=\"list\">\n		<li>\n			<a ui-sref=\"main.hardware\" ui-sref-active=\"active\" class=\"item\">\n				<i class=\"fa fa-cogs fa-fw\"></i>\n				硬件信息\n			</a>\n		</li>\n		<li>\n			<a ui-sref=\"main.channel\" ui-sref-active=\"active\" class=\"item\">\n				<i class=\"fa fa-star fa-fw\"></i>\n				频道管理\n			</a>\n		</li>\n		<li>\n			<a ui-sref=\"main.streams\" ui-sref-active=\"active\" class=\"item\">\n				<i class=\"fa fa-star fa-fw\"></i>\n				转码管理\n			</a>\n		</li>\n		<li>\n			<a ui-sref=\"main.network\" ui-sref-active=\"active\" class=\"item\">\n				<i class=\"fa fa-cogs fa-fw\"></i>\n				网络管理\n			</a>\n		</li>\n	</ul>\n	<div nd-notification ng-show=\"notificationShow\" ng-class=\"\'text-\' + type\" class=\"notification\">\n		<i ng-if=\"type === \'success\'\" class=\"fa fa-check-circle fa-fw\"></i>\n		<i ng-if=\"type === \'warning\'\" class=\"fa fa-warning fa-fw\"></i>\n		<i ng-if=\"type === \'danger\'\" class=\"fa fa-times-circle fa-fw\"></i>\n		{{message}}\n	</div>\n</nav>");
$templateCache.put("network.view.html","<!-- 配置 -->\n<div class=\"modal fade\" id=\"networkModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"networkModalTitle\" aria-hidden=\"true\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n        <h4 class=\"modal-title\" id=\"networkModalTitle\">配置网卡</h4>\n      </div>\n      <div class=\"modal-body\">\n        <form ng-submit=\"saveNetworkConfig()\" class=\"form-horizontal\" id=\"networkForm\" name=\"networkForm\" novalidate>\n          <div ng-class=\"{ \'has-error\': networkForm.address.$touched && networkForm.address.$invalid }\" class=\"form-group\">\n            <label for=\"address\" class=\"col-sm-2 control-label\">* 网络地址：</label>\n            <div class=\"col-sm-10\">\n              <input ng-model=\"networkConfig.address\" ng-pattern=\"/^((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))$/\" type=\"text\" class=\"form-control\" id=\"address\" name=\"address\" placeholder=\"请输入IP地址\" required>\n            </div>\n          </div>\n          <div ng-class=\"{ \'has-error\': networkForm.netmask.$touched && networkForm.netmask.$invalid }\" class=\"form-group\">\n            <label for=\"netmask\" class=\"col-sm-2 control-label\">* 子网掩码：</label>\n            <div class=\"col-sm-10\">\n              <input ng-model=\"networkConfig.netmask\" ng-pattern=\"/^((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))$/\" type=\"text\" class=\"form-control\" id=\"netmask\" name=\"netmask\" placeholder=\"请输入子网掩码地址\" required>\n            </div>\n          </div>\n          <!--<div ng-if=\"networkConfig.name !== \'lo\'\" ng-class=\"{ \'has-error\': networkForm.gw.$touched && networkForm.gw.$invalid }\" class=\"form-group\">-->\n            <!--<label for=\"gw\" class=\"col-sm-2 control-label\">* 网关地址：</label>-->\n            <!--<div class=\"col-sm-10\">-->\n              <!--<input ng-model=\"$parent.networkConfig.gw\" ng-pattern=\"/^((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))$/\" type=\"text\" class=\"form-control\" id=\"gw\" name=\"gw\" placeholder=\"请输入网关地址\" required>-->\n            <!--</div>-->\n          <!--</div>-->\n        </form>\n      </div>\n      <div class=\"modal-footer\">\n        <button class=\"btn btn-default\" type=\"button\" data-dismiss=\"modal\">取消</button>\n        <button ng-disabled=\"networkForm.$invalid\" class=\"btn btn-primary\" type=\"submit\" form=\"networkForm\"><i class=\"fa fa-save\"></i> 保存配置</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- 主体 -->\n<div ui-view class=\"view clearfix\">\n  <div class=\"page-header clearfix\">\n    <ol class=\"heading\">\n      <li><a ui-sref=\"main.sites\">网络管理</a></li>\n    </ol>\n  </div>\n  <div class=\"panel panel-default clear-bottom-margin\">\n    <div class=\"panel-body table-responsive\">\n      <table class=\"table table-hover\">\n        <thead class=\"text-center\">\n        <tr>\n          <th>设备</th>\n          <th>地址</th>\n          <th>子网掩码</th>\n          <!--<th>网关</th>-->\n          <th>MAC</th>\n          <th>启用</th>\n          <th>操作</th>\n        </tr>\n        </thead>\n        <tbody class=\"text-center text-middle\">\n        <tr ng-repeat=\"item in network\">\n          <td>{{item.name}}</td>\n          <td>{{item.address}}</td>\n          <td>{{item.netmask}}</td>\n          <td>{{item.mac}}</td>\n          <td>\n            <i ng-class=\"{ \'fa-toggle-on text-success\': item.active === true, \'fa-toggle-off text-muted\': item.active === false }\" ng-click=\"changeNetwork(item)\" class=\"fa fa-2x pointer\"></i>\n          </td>\n          <td>\n            <button ng-click=\"networkModel(item)\" type=\"button\" class=\"btn btn-default btn-xs\"><i class=\"fa fa-edit\"></i> 配置</button>\n          </td>\n        </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>");
$templateCache.put("sign-in.view.html","<article class=\"sign-in\">\n  <div ng-class=\"{ \'shake\': animateShake }\" class=\"content\">\n    <div class=\"brand\">转码平台</div>\n    <div class=\"panel panel-default\">\n      <div class=\"panel-body\">\n        <form ng-if=\"!hasKeyValue\" ng-submit=\"$parent.keyForm()\" id=\"keyForm\" name=\"keyForm\" novalidate>\n          <div class=\"form-group\">\n            <label for=\"keyMac\">机器码：</label>\n            <div class=\"input-group\">\n              <span class=\"input-group-addon\" id=\"inputIconKeyMac\"><i class=\"fa fa-desktop fa-fw\"></i></span>\n              <input  class=\"form-control\" id=\"keyMac\" type=\"text\" name=\"keyMac\" value=\"{{keyMac}}\" aria-describedby=\"inputIconKeyMac\" required readonly>\n            </div>\n          </div>\n          <div ng-class=\"{ \'has-error\': (keyForm.keyValue.$touched && keyForm.keyValue.$invalid) || wrong }\" class=\"form-group\">\n            <label for=\"keyValue\">序列号：</label>\n            <div class=\"input-group\">\n              <span class=\"input-group-addon\" id=\"inputIconPwd\"><i class=\"fa fa-lock fa-fw\"></i></span>\n              <input ng-model=\"$parent.keyValue\" ng-minlength=\"6\" ng-disabled=\"transmitting\" class=\"form-control\" id=\"keyValue\" type=\"text\" name=\"keyValue\" placeholder=\"请输入序列号\" aria-describedby=\"inputIconPwd\" required>\n            </div>\n          </div>\n          <button ng-disabled=\"keyForm.$invalid || transmitting\" class=\"btn btn-primary btn-block\" form=\"keyForm\" type=\"submit\">授权</button>\n        </form>\n        <form ng-if=\"hasKeyValue\" ng-submit=\"$parent.signIn()\" id=\"signInForm\" name=\"signInForm\" novalidate>\n          <div ng-class=\"{ \'has-error\': (signInForm.username.$touched && signInForm.username.$invalid) || wrong }\" class=\"form-group\">\n            <label for=\"username\">账号：</label>\n            <div class=\"input-group\">\n              <span class=\"input-group-addon\" id=\"inputIconAccount\"><i class=\"fa fa-desktop fa-fw\"></i></span>\n              <input ng-model=\"$parent.username\" ng-disabled=\"transmitting\" class=\"form-control\" id=\"username\" type=\"text\" name=\"username\" placeholder=\"请输入账号\" aria-describedby=\"inputIconUsername\" required>\n            </div>\n          </div>\n          <div ng-class=\"{ \'has-error\': (signInForm.password.$touched && signInForm.password.$invalid) || wrong }\" class=\"form-group\">\n            <label for=\"password\">密码：</label>\n            <div class=\"input-group\">\n              <span class=\"input-group-addon\" id=\"inputIconPwd\"><i class=\"fa fa-lock fa-fw\"></i></span>\n              <input ng-model=\"$parent.password\" ng-minlength=\"6\" ng-disabled=\"transmitting\" class=\"form-control\" id=\"password\" type=\"password\" name=\"password\" placeholder=\"请输入密码\" aria-describedby=\"inputIconPwd\" required>\n            </div>\n          </div>\n          <button ng-disabled=\"signInForm.$invalid || transmitting\" class=\"btn btn-primary btn-block\" form=\"signInForm\" type=\"submit\">登陆</button>\n        </form>\n      </div>\n    </div>\n  </div>\n</article>");
$templateCache.put("streams-change.view.html","<div class=\"page-header clearfix\">\n    <ol ng-if=\"action === \'create\'\" class=\"heading\">\n        <li><a ui-sref=\"main.streams\">转码管理</a></li>\n        <li><a ui-sref=\"main.streams.create\">新增转码</a></li>\n    </ol>\n    <ol ng-if=\"action === \'update\'\" class=\"heading\">\n        <li><a ui-sref=\"main.streams\">转码管理</a></li>\n        <li><a ui-sref=\"main.streams.update({ _id: _id })\">更新转码</a></li>\n    </ol>\n</div>\n<div class=\"panel panel-default\">\n    <div class=\"panel-body\">\n        <form ng-submit=\"saveStream()\" class=\"form-horizontal\" id=\"streamForm\" name=\"streamForm\" novalidate>\n            <div ng-class=\"{ \'has-error\': streamForm.name.$touched && streamForm.name.$invalid }\" class=\"form-group\">\n                <label for=\"name\" class=\"col-sm-2 control-label\">* 频道名称：</label>\n                <div class=\"col-sm-10\">\n                    <input ng-model=\"name\" ng-pattern=\"/^\\w+$/\" ng-disabled=\"transmitting\" class=\"form-control\" id=\"name\" type=\"text\" name=\"name\" placeholder=\"请输入以频道名称，例如 cctv1\" required>\n                    <p ng-show=\"streamForm.name.$touched && streamForm.name.$invalid\" class=\"help-block\">频道名称仅允许输入英文</p>\n                </div>\n            </div>\n            <div ng-class=\"{ \'has-error\': streamForm.url.$touched && streamForm.url.$invalid }\" class=\"form-group\">\n                <label for=\"url\" class=\"col-sm-2 control-label\">* 输入地址：</label>\n                <div class=\"col-sm-10\">\n                    <input ng-model=\"url\" ng-disabled=\"transmitting\" class=\"form-control\" id=\"url\" type=\"text\" name=\"url\" placeholder=\"请输入来源地址\" required>\n                </div>\n            </div>\n            <div ng-class=\"{ \'has-error\': streamForm.hls.$touched && streamForm.hls.$invalid }\" class=\"form-group\">\n                <label for=\"hls\" class=\"col-sm-2 control-label\">hls 开关：</label>\n                <div class=\"col-sm-10\">\n                    <i ng-class=\"{ \'fa-toggle-on text-success\': hls === true, \'fa-toggle-off text-muted\': hls === false }\" ng-click=\"hls = !hls\" class=\"fa fa-2x pointer\"></i>\n                </div>\n            </div>\n            <div ng-class=\"{ \'has-error\': streamForm.muhicast.$touched && streamForm.muhicast.$invalid }\" class=\"form-group\">\n                <label for=\"muhicast\" class=\"col-sm-2 control-label\">组播开关：</label>\n                <div class=\"col-sm-10\">\n                    <i ng-class=\"{ \'fa-toggle-on text-success\': muhicast === true, \'fa-toggle-off text-muted\': muhicast === false }\" ng-click=\"muhicast = !muhicast\" class=\"fa fa-2x pointer\"></i>\n                </div>\n            </div>\n            <div ng-if=\"muhicast\" ng-class=\"{ \'has-error\': streamForm.network.$touched && streamForm.network.$invalid }\" class=\"form-group\">\n                <label for=\"network\" class=\"col-sm-2 control-label\">* 组播输出网卡：</label>\n                <div class=\"col-sm-10\">\n                    <select ng-model=\"$parent.networkName\" ng-options=\"item.name as item.name for item in network\" ng-disabled=\"$parent.transmitting\" id=\"network\" class=\"form-control\" required>\n                        <option value=\"\">请选择网卡</option>\n                    </select>\n                </div>\n            </div>\n            <div ng-if=\"muhicast\" ng-class=\"{ \'has-error\': streamForm.outUrl.$touched && streamForm.outUrl.$invalid }\" class=\"form-group\">\n                <label for=\"outUrl\" class=\"col-sm-2 control-label\">* 组播输出地址：</label>\n                <div class=\"col-sm-10\">\n                    <input ng-model=\"$parent.outUrl\" ng-pattern=\"/^udp:\\/\\//\" ng-disabled=\"transmitting\" class=\"form-control\" id=\"outUrl\" type=\"text\" name=\"outUrl\" placeholder=\"请输入组播输出地址\" required>\n                    <p ng-show=\"streamForm.outUrl.$touched && streamForm.outUrl.$invalid\" class=\"help-block\">输出组播地址必须以 udp:// 开头</p>\n                </div>\n            </div>\n        </form>\n    </div>\n</div>\n<button ng-disabled=\"transmitting || inputing || streamForm.$invalid\" class=\"btn btn-primary pull-right\" form=\"streamForm\" type=\"submit\"><i class=\"fa fa-save\"></i> 保存频道</button>");
$templateCache.put("streams.view.html","<!-- 删除模态 -->\n<div class=\"modal fade\" id=\"deleteModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"deleteModalTitle\" aria-hidden=\"true\">\n  <div class=\"modal-dialog modal-sm\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"关闭\"><span aria-hidden=\"true\">&times;</span></button>\n        <h4 class=\"modal-title\" id=\"deleteModalTitle\">警告</h4>\n      </div>\n      <div class=\"modal-body\">\n        <h4 class=\"text-center\">您确定要删除该转码？</h4>\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">取消</button>\n        <button ng-disabled=\"transmitting\" ng-click=\"deleteStream()\" type=\"button\" class=\"btn btn-danger\">确认删除</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div ui-view class=\"view clearfix\">\n  <div class=\"page-header clearfix\">\n    <ol class=\"heading pull-left\">\n      <li><a ui-sref=\"main.streams\">转码管理</a></li>\n    </ol>\n    <a ui-sref=\"main.streams.create\" class=\"btn btn-primary btn-sm pull-right\"><i class=\"fa fa-pencil\"></i> 新增转码</a>\n  </div>\n  <div class=\"panel panel-default clear-bottom-margin\">\n    <div class=\"panel-body table-responsive\">\n      <table class=\"table table-hover\">\n        <thead class=\"text-center\">\n        <tr>\n          <th>频道ID</th>\n          <th>频道名称</th>\n          <th>输入地址</th>\n          <th>格式</th>\n          <th>输入网卡</th>\n          <th>输出网卡</th>\n          <th>输出地址</th>\n          <th>激活</th>\n          <th>操作</th>\n        </tr>\n        </thead>\n        <tbody class=\"text-center text-middle\">\n        <tr ng-repeat=\"item in stream\">\n          <td>{{item.id}}</td>\n          <td>{{item.name}}</td>\n          <td>{{item.url | words: 20}}</td>\n          <td></td>\n          <td></td>\n          <td>{{item.network ? item.network : \'-\'}}</td>\n          <td>{{item.outUrl ? item.outUrl : \'-\'}}</td>\n          <td>\n            <i ng-if=\"item.pid\" ng-class=\"{ \'fa-toggle-on text-success\': item.active === true, \'fa-toggle-off text-muted\': item.active === false }\" ng-click=\"switchActive(item)\" class=\"fa fa-2x pointer\"></i>\n            <span ng-if=\"!item.pid\">-</span>\n          </td>\n          <td>\n            <a ui-sref=\"main.streams.update({ id: item.id })\" class=\"btn btn-default btn-xs\"><i class=\"fa fa-edit\"></i> 修改</a>\n            <button ng-click=\"$parent.$parent.deleteStreamId = item.id\" class=\"btn btn-default btn-xs\" type=\"button\" data-toggle=\"modal\" data-target=\"#deleteModal\"><i class=\"fa fa-trash-o\"></i> 删除</button>\n          </td>\n        </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>");}]);