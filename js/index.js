/**
 * Created by Administrator on 2016/10/15.
 */
//window.$ = require('jquery');
window.THREE = require('three');
require("./TrackballControls.js");

window.runScript = function() {
    setTimeout(function(){
        $('#startGif').fadeOut();
    },5000);
    //开启Three.js渲染器
    var renderer;//声明全局变量（对象）
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
        camera.position.x = -0.2;//设置相机的位置坐标
        camera.position.y = 0;//设置相机的位置坐标
        camera.position.z = 1;//设置相机的位置坐标
        camera.up.x = 0;//设置相机的上为「x」轴方向
        camera.up.y = 1;//设置相机的上为「y」轴方向
        camera.up.z = 0;//设置相机的上为「z」轴方向
    }


//设置控制器
    var trackballControls;
    function initControls() {
        trackballControls = new THREE.TrackballControls(camera);
        trackballControls.rotateSpeed = 2;
        trackballControls.zoomSpeed = 0.1;
    }

    //设置全景图
    var textureCube;
    function initPano() {
        function createCubeMap(){
            var path = "./cubemap/";
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
    var clock = new THREE.Clock();
    function loopRender(){
        renderer.clear();
        var delta = clock.getDelta();
        trackballControls.update(delta);
        renderer.render(scene, camera);
        requestAnimationFrame(loopRender);
    }
    function threeStart() {
        initThree();
        initCamera();
        initScene();
        initControls();
        initPano();
        loopRender();
    }
    threeStart();

}
