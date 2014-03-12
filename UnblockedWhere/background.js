//Code by Stefan Petersen. Contact if you have any suggestions or problems.

//placeholder country if geoIP request fails, will not match any Youtube data
var country = "Country_not_found";
var user_country = "Country_not_found";
var unblocked_country = "No country";
var blocked_country = "null";
var country_list = [];
var country_sugg = new Array(4);
//Countries for notification, mostly ordered by how easy it is to find a proxy for them
var all_countries = {"countries": [
  {name: 'United States', code: 'US'},
  {name: 'Canada', code: 'CA'},
  {name: 'The United Kingdom', code: 'GB'},  
  {name: 'Germany', code: 'DE'},
  {name: 'Brazil', code: 'BR'},
  {name: 'Japan', code: 'JP'},
  {name: 'Australia', code: 'AU'},  
  {name: 'Italy', code: 'IT'},
  {name: 'Switzerland', code: 'CH'},
  {name: 'Korea', code: 'KR'},
  {name: 'France', code: 'FR'}, 
  {name: 'India', code: 'IN'},
  {name: 'Czech Republic', code: 'CZ'},
  {name: 'Vietnam', code: 'VN'},
  {name: 'Indonesia', code: 'ID'},
  {name: 'Belgium', code: 'BE'},
  {name: 'Austria', code: 'AT'}, 
  {name: 'Chile', code: 'CL'}, 
  {name: 'Denmark', code: 'DK'},  
  {name: 'Argentina', code: 'AR'},
  {name: 'Greece', code: 'GR'},
  {name: 'El Salvador', code: 'SV'}, 
  {name: 'Finland', code: 'FI'}, 
  {name: 'Ireland', code: 'IE'},
  {name: 'Netherlands', code: 'NL'}, 
  {name: 'Norway', code: 'NO'}, 
  {name: 'South Africa', code: 'ZA'}, 
  {name: 'Spain', code: 'ES'}, 
  {name: 'Sweden', code: 'SE'},  
  {name: 'Bangladesh', code: 'BD'}, 
  {name: 'Barbados', code: 'BB'}, 
  {name: 'Belarus', code: 'BY'},  
  {name: 'Belize', code: 'BZ'},  
  {name: 'Bermuda', code: 'BM'},  
  {name: 'Bulgaria', code: 'BG'},    
  {name: 'Colombia', code: 'CO'},  
  {name: 'Costa Rica', code: 'CR'},  
  {name: 'Croatia', code: 'HR'}, 
  {name: 'Cuba', code: 'CU'},   
  {name: 'Dominica', code: 'DM'}, 
  {name: 'Dominican Republic', code: 'DO'}, 
  {name: 'Ecuador', code: 'EC'}, 
  {name: 'Egypt', code: 'EG'},  
  {name: 'Greenland', code: 'GL'}, 
  {name: 'Honduras', code: 'HN'}, 
  {name: 'Hong Kong', code: 'HK'}, 
  {name: 'Hungary', code: 'HU'}, 
  {name: 'Iceland', code: 'IS'},   
  {name: 'Israel', code: 'IL'},  
  {name: 'Jamaica', code: 'JM'}, 
  {name: 'Malaysia', code: 'MY'}, 
  {name: 'Maldives', code: 'MV'}, 
  {name: 'Mali', code: 'ML'}, 
  {name: 'Mexico', code: 'MX'}, 
  {name: 'Monaco', code: 'MC'},   
  {name: 'Paraguay', code: 'PY'}, 
  {name: 'Peru', code: 'PE'}, 
  {name: 'Philippines', code: 'PH'}, 
  {name: 'Portugal', code: 'PT'}, 
  {name: 'Puerto Rico', code: 'PR'}, 
  {name: 'Senegal', code: 'SN'},   
  {name: 'Venezuela', code: 'VE'},  
]};
//sends a request to a geoIP service to collect the user's country data
jQuery.getJSON('https://freegeoip.net/json/', function(location) {
	user_country = location.country_code;
	});

//Real programmers have super high complexities 	
function checkUrl(tab) {
	//check if it's a Youtube video
	if (tab.url.match(/youtube/) && tab.url.match(/watch/)) {
		//gets video id
		var video_id=removeVideoPrefix('http://www.youtube.com/watch?v=', tab.url);
		var video_id_2 = removeVideoSuffix(video_id);
		//gets video details from YouTube API
		jQuery.getJSON('https://gdata.youtube.com/feeds/api/videos/'+video_id_2+'?v=2&alt=jsonc',function(data,status,xhr){
			if(typeof (data.data.restrictions) == "undefined"){
				//placeholder, will not match any strings
				country = "North Korea";
				}
			else{
				//Checks video restrictions against user's country
				for (i = 0; i < data.data.restrictions[0].countries.length; i+=3) {
					var countryprefix = data.data.restrictions[0].countries[i];
					var countrysuffix = countryprefix.concat(data.data.restrictions[0].countries[i+1]);
					if (countrysuffix == user_country) {
						blocked_country = countrysuffix;
					}
				}
				//If it's blocked
				if (blocked_country != "null") {
					for (j = 0; j < data.data.restrictions[0].countries.length-3; j+=3) {
						var country3 = data.data.restrictions[0].countries[j];
						var country4 = country3.concat(data.data.restrictions[0].countries[j+1]);
						//Creates array of all blocked countries
						country_list.push(country4);
					}	
					//Builds list of country suggestions
					if (country_list.length > 2) {
						var i = 0;
						var i = 0;
						while (i < 4) {
							for (j = 0; j < all_countries.countries.length; j++) {
								if (jQuery.inArray(all_countries.countries[j].code, country_list) == -1) {
									country_sugg[i] = all_countries.countries[j].name;
									i++;
								}
							}	
						}
						//grammar
						unblocked_country = "Some countries where it isn't blocked are "+country_sugg[0]+', '+country_sugg[1]+', '+country_sugg[2]+', and '+country_sugg[3]+'.';
					}
					else {
						unblocked_country = "The video is unblocked everywhere else.";
					}
				var notification = webkitNotifications.createNotification(
				'icon.png',  
				'Unblocked Where',
				'This video is blocked in your location. '+unblocked_country
				); 
				notification.show();
				}
			}
		});
	}
};
//extracts unique URL for API request
function removeVideoPrefix(prefix,s) {
    return s.substr(prefix.length);
}
//if video is in a playlist, there will be extra characters after unique id
function removeVideoSuffix(video_url) {
	var position = video_url.indexOf('&');
	if (position == -1) {
		return video_url;
		}
	else {
		var video2 = video_url.substring(0, video_url.length-(video_url.length-position));
		return video2;
		}
	}
//checks every time a tab status changes
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo.status == "loading") {
        checkUrl(tab);
    }
});
