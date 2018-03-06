import { bridge } from '../main';
import { nameToId } from '../utils/translator';

export default class Lights{

    
    /** 
     * Get all informations about all the lights connected to the bridge
     */
    getAllLights(){
        let url = 'http://' + bridge.getIP() + "/api/" + bridge.getApiKey() + "/lights/";
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send(null);
        return JSON.parse(xhr.responseText);
    }
    
    /**
     * 
     * Get light id by name
     * 
     * @param {string} name 
     */
    getLightByName(name){
        let lights = this.getAllLights();
        let id = nameToId(lights, name);
        if(id == false){
            console.log("Light not found: " + name);
            return -1;
        }else{
            return lights[id];
        }
    }

    /**
     * 
     * Modify all states of a paritcular light
     * 
     * @param {string} light 
     * @param {string} target 
     * @param {Object} newJSON 
     * @param {function} callback 
     */
    modifyLight(light, target, newJSON, callback = function(res){}){
        let match = ['state', 'swupddate', 'type', 'name', 'modelid', 'manufacturername', 'capabilities', 'uniqueid', 'swversion', 'swconfigid', 'productid'];
        if(match.indexOf(target) > -1){
            let url = 'http://' + bridge.getIP() + "/api/" + bridge.getApiKey() + "/lights/" + light +"/"+target;
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    callback(this.responseText);
                }
            }
            xhr.open('PUT', url, true);
            xhr.send(JSON.stringify(newJSON));
        }  
    }


    /**
     * 
     * Function to modify the different states of a particular group
     * 
     * @param {string} group 
     * @param {string} target 
     * @param {Object} newJSON 
     * @param {function} callback 
     */
    modifyGroup(group, target, newJSON, callback = function(res){}){
        let match = ['name', 'lights', 'type', 'state', 'recycle', 'action', 'xy', 'ct', 'alert', 'colormode'];
        if(match.indexOf(target) > -1){
            let url = 'http://' + bridge.getIP() + "/api/" + bridge.getApiKey() + "/groups/" + group + "/" + target;
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    callback(this.responseText);
                }else{
                    // console.log(this.readyState);
                    // console.log(this.response);
                }
            }
            xhr.open('PUT', url, true);
            xhr.send(JSON.stringify(newJSON));
        }else{
            console.log("Unknown target");
            return -2;
        }
        
    }

    /**
     * 
     * Checks if a particular group is on or off
     * 
     * @param {string} group 
     * @return {boolean}
     */
    isEntierGroupOn(group){
        let url = 'http://' + bridge.getIP() + "/api/" + bridge.getApiKey() + "/groups/" + group;  
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send(null);
        let response = JSON.parse(xhr.responseText);
        if(response.state.all_on != null){
            return response.state.all_on;
        }
    }

    /**
     * 
     * Switch group on or off
     * 
     * @param {string} group 
     * @param {function} callback 
     */
    switchOnOffGroup(group, callback = function(res){}){
        let url = 'http://' + bridge.getIP()  + "/api" + bridge.getApiKey() + "/groups/" + group + "/action";
        let data = {"on": false};
        if(this.isEntierGroupOn(group) == false){
            data = {"on": true};
        }
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){

                callback(this.responseText);
                
            }
        }
        xhr.open('PUT', url, true);
        xhr.send(JSON.stringify(data));
    }

}

