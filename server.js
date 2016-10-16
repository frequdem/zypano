/**
 * Created by Administrator on 2016/10/16.
 */
var express = require('express');
var app = express();
app.use(express.static('built'));
app.use(express.static('html'));
//app.use(express.static('images/cubemap/'));
app.use(express.static('images'));
app.use(express.static('js'));
app.listen(80);