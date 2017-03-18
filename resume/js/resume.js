$('document').ready(function() {
  //tag cloud moudule

  function tagCloud() {
    const board = document.getElementById('Skills'),
      R = 160, // 半径
      baseAngle = Math.PI / 360, // 单位角度, Math.PI / 360 * x  应该避免x是180的倍数，此时正好是半圈或者一圈 
      screenW = document.body.scrollWidth,//real dimension
      screenH = document.body.scrollHeight,
      length = R * 1.5; // 球心距离屏幕的z轴距离,应该大于R

    let tags = [],
      speed = 5, // 初始速度
      angleX = speed * baseAngle, // 绕x轴旋转角速度, 正负表示方向, 应该尽量保持角速度在[-2π, 2π] rad/单位时间, 2π 跟 4π的效果是一样的(同时转一圈和转两圈区别)
      angleY = -speed * baseAngle;
    var tag = function(ele, x, y, z) {
      this.ele = ele;
      this.x = x;
      this.y = y;
      this.z = z;
    };
    tag.prototype = {
      move: function() {
        let scale = length / (length - this.z),
          alpha = (this.z + R) / (2 * R),
          ele = this.ele;
        ele.style.fontSize = 15 * scale + "px";
        ele.style.opacity = alpha + 0.5;
        ele.style.zIndex = parseInt(scale * 100);
        // 原点是 (cloud.offsetWidth/2, cloud.offsetHeight/2)
        ele.style.left = this.x + board.offsetWidth / 2 - ele.offsetWidth / 2 + "px";
        ele.style.top = this.y + board.offsetHeight / 2 - ele.offsetHeight / 2 + "px";
      }
    };
    var init = function() {
      const tagEle = board.querySelectorAll('.tag'),
        tagLen = tagEle.length;
      for (let i = 0; i < tagLen; i++) {
        // 设置随机坐标，平均分布
        let a = Math.acos((2 * (i + 1) - 1) / tagLen - 1), // θ = arccos(((2*(i+1))-1)/len - 1),基于[-1,1]的关于0对称的等差数列
          b = a * Math.sqrt(tagLen * Math.PI), // Φ = θ*sqrt(all * π)，不懂原理
          x = R * Math.sin(a) * Math.cos(b), // x轴坐标: x=r*sinθ*cosΦ，详情请参考https://zh.wikipedia.org/wiki/%E7%90%83%E5%BA%A7%E6%A8%99%E7%B3%BB
          y = R * Math.sin(a) * Math.sin(b), // y轴坐标: x=r*sinθ*cosΦ
          z = R * Math.cos(a), // z轴坐标: z=r*cosθ
          t = new tag(tagEle[i], x, y, z);

        tagEle[i].style.color = '#' + Math.floor(Math.random() * 0xffffff).toString(16); // 设置随机颜色
        tags.push(t);
        t.move(); // 初始化位置
      }
      animate(); // 旋转
    };
    /*
    绕x轴旋转
    y = ycosθ - zsinθ;
    z = ysinθ + zcosθ;
    */
    function rotateX() {
      let cos = Math.cos(angleX),
        sin = Math.sin(angleX);
      tags.forEach(function(tag) {
        let y = tag.y * cos - tag.z * sin,
          z = tag.z * cos + tag.y * sin;
        tag.y = y;
        tag.z = z;
      })
    };
    /*
    绕y轴旋转
    x = xcosθ - zsinθ;
    z = xsinθ + zcosθ;
    */
    function rotateY() {
      let cos = Math.cos(angleY),
        sin = Math.sin(angleY);
      tags.forEach(function(tag) {
        let x = tag.x * cos - tag.z * sin,
          z = tag.z * cos + tag.x * sin;
        tag.x = x;
        tag.z = z;
      })
    };
    // 旋转
    function animate() {
      setInterval(function() {
        rotateX();
        rotateY();
        tags.forEach(function(tag) {
          tag.move();
        });
      }, 20);
    };
    init();
    board.addEventListener("mousemove", function(e) {
      // 横向控制 y 轴旋转，纵向控制 x 轴旋转
      angleY = 2 * (e.clientX / screenW - 0.5) * speed * baseAngle; // 越靠近中心，速度越小，中心两侧方向相反
      angleX = 2 * (e.clientY / screenH - 0.5) * speed * baseAngle;
    });
  }
  tagCloud();
  
  //动态置顶
  $('#ScrollTop').on('click',function(e) {
    e.preventDefault();
    $(document.body).animate({scrollTop: 0},800);
  });
    
  //高亮top nav
  $('body').scrollspy({target: '#navbar'});
});