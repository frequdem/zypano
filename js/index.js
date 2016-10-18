/**
 * Created by Administrator on 2016/10/15.
 */
//window.$ = require('jquery');
window.THREE = require('three');
require("./TrackballControls.js");

window.runScript = function() {
    //开启Three.js渲染器
    var renderer;//声明全局变量（对象）
    var width;
    var height;
    function initThree() {
        width = document.getElementById('canvas3d').clientWidth;//获取画布「canvas3d」的宽
        height = document.getElementById('canvas3d').clientHeight;//获取画布「canvas3d」的高
        renderer=new THREE.WebGLRenderer({antialias: true,alpha: true});//生成渲染器对象（属性：抗锯齿效果为设置有效）
        renderer.setSize(width, height );//指定渲染器的高宽（和画布框大小一致）
        document.getElementById('canvas3d').appendChild(renderer.domElement);//追加 【canvas】 元素到 【canvas3d】 元素中。
        renderer.setClearColor(0x000000, 0.0);//设置canvas背景色(clearColor)
    }

    //设置场景
    var scene;
    function initScene() {
        scene = new THREE.Scene();
    }

    //设置相机
    var camera;
    function initCamera() {
        camera = new THREE.PerspectiveCamera( 75, width / height , 0.2, 100000 );//设置透视投影的相机,默认情况下相机的上方向为Y轴，右方向为X轴，沿着Z轴朝里（视野角：fov 纵横比：aspect 相机离视体积最近的距离：near 相机离视体积最远的距离：far）
        camera.position.x = -0.5;//设置相机的位置坐标
        camera.position.y = 0;//设置相机的位置坐标
        camera.position.z = -1;//设置相机的位置坐标
        camera.up.x = 0;//设置相机的上为「x」轴方向
        camera.up.y = 1;//设置相机的上为「y」轴方向
        camera.up.z = 0;//设置相机的上为「z」轴方向
    }


//设置控制器
    var trackballControls;
    function initControls() {
        trackballControls = new THREE.TrackballControls(camera);
        trackballControls.rotateSpeed = 0.6;
        trackballControls.zoomSpeed = 0.1;
    }

    //设置全景图
    var textureCube;
    function initPano() {
        function createCubeMap(){
            var path = "./images/cubemap/";
//            var path = "/";
            var format = ".jpg";
            var urls = [
                    path + "left" + format,
                    path + "right" + format,
                    path + "up" + format,
                    path + "down" + format,
                    path + "back" + format,
                    path + "front" + format
            ];
            return THREE.ImageUtils.loadTextureCube(urls);
        }

        textureCube = createCubeMap();
        textureCube.minFilter = THREE.LinearFilter;
        var shader = THREE.ShaderLib["cube"];
        shader.uniforms["tCube"].value = textureCube;
        var material = new THREE.ShaderMaterial({
            fragmentShader:shader.fragmentShader,
            vertexShader:shader.vertexShader,
            uniforms:shader.uniforms,
            depthWrite:false,
            side:THREE.BackSide
        });
        cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(40000,40000,40000),material);
        cubeMesh.name = 'cubemap';
        scene.add(cubeMesh);
    }

    //执行
    var hotpotNames = ['hp1', 'hp2', 'hp3', 'hp4'];
    var hotpots = {};
    var hotpotJqs = {};
    hotpotJqs.hp1 = $('.hp1');
    hotpotJqs.hp2 = $('.hp2');
    hotpotJqs.hp3 = $('.hp3');
    hotpotJqs.hp4 = $('.hp4');
    var maskJq = $('#mask-for-tips');
    var hpClicked = [];
    var hpImgJqs = {};
    hpImgJqs.hp1 = $('.jscf');
    hpImgJqs.hp2 = $('.znyg');
    hpImgJqs.hp3 = $('.znsb');
    hpImgJqs.hp4 = $('.zdq');
    var kstjJq = $('#kstj');
    kstjJq.click(kstjClick);
    function bindTipsEvent() {
//        openLayer
        $.each(hotpotNames,function(index,val) {
            hotpotJqs[val].click(function(){
                if($.inArray(val,hpClicked) == -1){
                    hpClicked.push(val);
                }
                maskJq.show();
                hpImgJqs[val].show();
                trackballControls.dispose();
            })
        });

//        closeLayer
        $('.tips').click(function(){
            maskJq.hide();
            $.each(hotpotNames,function(index,val) {
                hpImgJqs[val].hide();
            });
            trackballControls.bind();
            if(hpClicked.length == 4){
                kstjJq.show();
            }
        })
    }
    var hpCanvasPos;
    var clock = new THREE.Clock();
    function loopRender(){
        renderer.clear();
        var delta = clock.getDelta();
        trackballControls.update(delta);
        hotpots.hp1 = new THREE.Vector3(-21.520496,-13.438619,96.727823);
        hotpots.hp2 = new THREE.Vector3(-57.40793,-13.438619,-80.76963);
        hotpots.hp3 = new THREE.Vector3(9.00112,-44.41023,-89.144329);
        hotpots.hp4 = new THREE.Vector3(99.247381,-8.279339,9.022741);
        $.each(hotpotNames,function(index,val) {
            hotpots[val].project(camera);
            hpCanvasPos = hotpots[val].toArray();
            if(hpCanvasPos[2]<1){
                hotpotJqs[val].css({
                    "transform": "translate(" + (hpCanvasPos[0]+1)/2*width + "px," + (1 - hpCanvasPos[1])/2*height + "px)",
                    "-webkit-transform": "translate(" + (hpCanvasPos[0]+1)/2*width + "px," + (1 - hpCanvasPos[1])/2*height + "px)"
                });
            }
        });
        renderer.render(scene, camera);
        requestAnimationFrame(loopRender);
    }
    function threeStart() {
        initThree();
        initCamera();
        initScene();
        initControls();
        initPano();
        bindTipsEvent();
        loopRender();
    }
    threeStart();

    function kstjClick() {
        alert('开始调剂');
        $('#before-panorama').hide();
    }

};
