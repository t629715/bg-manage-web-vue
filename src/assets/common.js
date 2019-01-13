import Vue from "vue"

Vue.prototype.$subStr = function (value,start,end) {
    return value.toString().substring(start,end);
}
