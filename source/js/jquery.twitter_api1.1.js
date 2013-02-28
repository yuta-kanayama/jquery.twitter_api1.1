var jTwitter = {
	init: function(opt){
		var prm = {
			api: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
			count: 50,
			callback: undefined,
			consumerKey: undefined,
			consumerSecret: undefined,
			accessToken: undefined,
			tokenSecret: undefined
		}
		for(var key in opt) prm[key] = opt[key];
		
		var message = {
			method: "GET",
			action: prm.api,
			parameters: {
				oauth_version: "1.0",
				oauth_signature_method: "HMAC-SHA1",
				oauth_consumer_key: prm.consumerKey,
				oauth_token: prm.accessToken
			}
		}
		var content = {
			count: String(prm.count),
			callback: prm.callback
		}
		for(var key in content){
			message.parameters[key] = content[key];
		}
		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, {
			consumerSecret: prm.consumerSecret,
			tokenSecret: prm.tokenSecret
		});
		var target = OAuth.addToURL(message.action, message.parameters);
		
		$.ajax({
			type: message.method,
			url: target,
			dataType: "jsonp",
			jsonp: false,
			cache: true
		});
		
	},
	created_at_fnc: function(value){
		var self = this;
		var created_at = value.split(' ');
		// 投稿日時変換 "Mon Dec 01 14:24:26 +0000 2008" -> "Dec 01, 2008 14:24:26"
		var post_date = created_at[1]+" "+created_at[2]+", "+created_at[5]+" "+created_at[3];
		var date = new Date(post_date);
		date.setHours(date.getHours()+9);
		var year = date.getFullYear();
		var mon = self.conv2deg(date.getMonth()+1);
		var day = self.conv2deg(date.getDate());
		var hours = self.conv2deg(date.getHours());
		var minutes = self.conv2deg(date.getMinutes());
		var result = year+'.'+mon+'.'+day+' '+hours+':'+minutes;
		return result;
	},
	conv2deg: function(val){val="00"+val;return val.substr(val.length-2,2);}
};

