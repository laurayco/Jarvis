const dgram = require('dgram');

(function(module){

  function areBuffersEqual(bufA, bufB) {
    var len = bufA.length;
    if (len !== bufB.length) {
      return false;
    }
    for (var i = 0; i < len; i++) {
      if (bufA.readUInt8(i) !== bufB.readUInt8(i)) {
        return false;
      }
    }
    return true;
  }

  function dot2num(dot) {
    var d = dot.split('.');
    return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
  }

  function num2dot(num) {
    var d = (num&0xFF).toString();
    for (var i = 3; i > 0; i--) {
      num = num >> 8;
      d = (num&0xFF).toString() + '.' + d;
    }
    return d;
  }

  module.JARVIS_TIMEOUT = .5 * 1000;//half second response time?
  module.JARVIS_PORT = 8000;
  module.JARVIS_GROUP = '230.185.192.108';

  var Statement = (function(text){
    this.text = text;
    this.critical = text.indexOf("!") >= 0;
    this.kind = (function(text){
      if(text.indexOf("?") >= 0) {
        return "q";
      } else {
        return "a";//data assertion
        // return "i";//imperative
      }
    });
    return this;
  });

  Statement.prototype.process = (function(j_interface,cb){
    if(this.kind==='q') {
      j_interface.execute_query(this,cb);
    } else if(this.kind==='a') {
      j_interface.assert_data(this,false,cb);
    } else if(this.kind==='i') {
      j_interface.execute_action(this,cb);
    }
  });

  var Jarvis = (function(){
    this.available_apis = {};//service-name
    return this;
  });

  Jarvis.prototype.register_api = (function(svc_name,host,port){
    this.available_apis[svc_name] = {
      'host':host,
      'port':port
    }
  });

  /*
    Jarvis Class will not be exported.
    It is internal use only, and will be
    launched in a single-instance server
    when jarvis.js is executed on its own.
  */

  var JarvisInterface = (function(){
    return this;
  });

  JarvisInterface.prototype.execute_query = (function(query,cb){
    cb();
  });

  JarvisInterface.prototype.execute_action = (function(command,cb){
    cb();
  });

  JarvisInterface.prototype.assert_data = (function(statement,confirmed,cb){
    cb();
  });

  module.JarvisInterface = JarvisInterface;

  var ServiceRegistry = (function(){
    this.jarvis_server = null;
    this.discovered_services = {};
    this.dgram_sock = null;
    this.locate_message = new Buffer("Jarvis?");
    this.greeting = new Buffer("Hello, sir.");
    this.jarvis_location = null;
    this.jarvis_search = null;
    this.on_jarvis_found = (function(){
      console.log("Found Jarvis.");
    });
    return this;
  });

  ServiceRegistry.prototype.init = (function(cb){
    this.dgram_sock = dgram.createSocket({
      type:"udp4",
      reuseAddr:true
    });
    this.dgram_sock.on("listening",this.find_jarvis.bind(this,cb));
    this.dgram_sock.on("message",this.process_message.bind(this));
    this.dgram_sock.bind(module.JARVIS_PORT);
  });

  ServiceRegistry.prototype.process_message = (function(msg,rinfo){
    if(this.jarvis_location===null) {
      if(areBuffersEqual(this.greeting,msg)) {
        console.log("Found Jarvis:",rinfo);
        clearTimeout(this.jarvis_search);
        this.jarvis_search = null;
        this.jarvis_location = rinfo;
        this.on_jarvis_found();
      }
    } else if(areBuffersEqual(msg,this.locate_message)) {
      this.dgram_sock.send(this.greeting,0,this.greeting.length,module.JARVIS_PORT,module.JARVIS_GROUP,(function(err){
        console.log("Datagram sent:",err?err:"success.");
        console.log("There can be only one JARVIS.");
      }));
    } else {
      // possibly a service registration.
      if(msg[0]===0xFF&&msg.length>6) {
        var svc_port = msg.readUInt16BE(1);
        var svc_addr = rinfo.address;
        var svcname = msg.toString('utf8',3);
        console.log("Registering",svcname,"on port",svc_port,"at host",svc_addr);
      }
    }
  });

  ServiceRegistry.prototype.create_jarvis = (function(){
    console.log("I am Jarvis now.");
    this.jarvis_search = null;
    this.jarvis_location = true;
    this.on_jarvis_found();
  });

  ServiceRegistry.prototype.find_jarvis = (function(cb){
    var msg = this.locate_message;
    this.on_jarvis_found = cb;
    this.dgram_sock.setBroadcast(true)
    this.dgram_sock.setMulticastTTL(128);
    this.dgram_sock.addMembership(module.JARVIS_GROUP,"0.0.0.0");
    this.dgram_sock.send(msg,0,msg.length,module.JARVIS_PORT,module.JARVIS_GROUP,(function(err){
      console.log("Datagram sent:",err?err:"success.");
      this.jarvis_search = setTimeout(this.create_jarvis.bind(this),module.JARVIS_TIMEOUT);
    }).bind(this))
  });

  ServiceRegistry.prototype.connect_service = (function(svcname,portnum){
    var buf = new Buffer(3+svcname.length);
    buf.writeUInt8(0xFF);
    buf.writeUInt16BE(portnum,1);
    buf.write(svcname,3);
    this.dgram_sock.send(buf,0,buf.length,module.JARVIS_PORT,module.JARVIS_GROUP,(function(err){
      console.log("Service registering data sent.");
    }));
  });

  module.ServiceRegistry = ServiceRegistry;
})(exports);
