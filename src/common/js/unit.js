import $ from "jquery"

export default {
    changeTitle (src) {
        document.title = src;
    },
    adapt (designWidth, rem2px) {
        var d = window.document.createElement('div');
        d.style.width = '1rem';
        d.style.display = "none";
        var head = window.document.getElementsByTagName('head')[0];
        head.appendChild(d);
        var defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));
        d.remove();
        //mobile
        if (this.browserRedirect()) {
            document.documentElement.style.fontSize = window.innerWidth / designWidth * rem2px / defaultFontSize * 100 + '%';
            var st = document.createElement('style');
            var portrait = "@media screen and (min-width: " + window.innerWidth + "px) {html{font-size:" + ((window.innerWidth / (designWidth / rem2px) / defaultFontSize) * 100) + "%;}}";
            var landscape = "@media screen and (min-width: " + window.innerHeight + "px) {html{font-size:" + ((window.innerHeight / (designWidth / rem2px) / defaultFontSize) * 100) + "%;}}"
            st.innerHTML = portrait + landscape;
            head.appendChild(st);
            return defaultFontSize
        }
        //pc
        else {
            document.documentElement.style.fontSize = window.innerWidth / designWidth * rem2px / defaultFontSize * 100 + '%';
            var st = document.createElement('style');
            var portrait = "@media screen and (min-width: " + window.innerWidth + "px) {html{font-size:" + ((window.innerWidth / (designWidth / rem2px) / defaultFontSize) * 100) + "%;}}";
            var landscape = "@media screen and (min-width: " + window.innerHeight + "px) {html{font-size:" + ((window.innerHeight / (designWidth / rem2px) / defaultFontSize) * 100) + "%;}}"
            st.innerHTML = portrait + landscape + 'html{ font-size: 424%!important;  margin: 0 auto;}; body{ margin: 0 auto; }';
            head.appendChild(st);
            return defaultFontSize
        }
    },
    browserRedirect () {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return true;
        } else {
            return false;
        }
    },
    getSong(id,callback){
        console.log(id)
        $.get("https://api.imjad.cn/cloudmusic/" + '?type=song&id=' + id).then(function (data){
            if(data.code == 200){
                callback(data);
            }
        })
    },
    play () {
        console.log("play")
        var _audio = document.querySelector("#audio");
        _audio.play();
    },
    pause () {
        console.log("pause")
        document.querySelector("#audio").pause();
    },
    getUserInfo () {
        var user = JSON.parse(window.localStorage.user);
        if (user != undefined && user != '' && user != null) {
            return user;
        } else {
            return false;
        }
    },
    login (userName, nickName, pic) {
        var user = {
            userName: userName,
            nickName: nickName,
            pic: pic
        }
        window.localStorage.user = JSON.stringify(user);
    },
    loginOut (callback) {
        console.log("退出登录！")
        window.localStorage.user = '';
        callback();
    }
}