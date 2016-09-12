import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';

import { AngularFire } from 'angularfire2';

import {User} from '../models/user';


@Injectable()
export class MacAddressService {
    apiUrl: "http://";
    macAddress: string;
    user: User;
    constructor(private http: Http, private angularFire2: AngularFire) {
        this.macAddress = this.getMacId();
        this.user = this.getUser();
        this.getIpAddress(function(ip: string){
            alert(ip);
            // local IPs
            if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/))
            {}
            // IPv6 addresses
            else if (ip.match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/))
            {}
            // assume the rest are public IPs
            else
            {}
       });
    }

    getMacId(): string {
        return '343984039434';
        // return this.http.get(this.apiUrl)
        //    .toPromise().then((res: Response) => res.json(), error => console.log(error));
    }

    getUser(): User {
        let u = new User();
        u.name = 'tuannguyen';
        u.password = '123456';
        u.email = 'tuannguyen@nhatvietgroup.com.vn';
        return u;
    }

   getIpAddress(callback: (callback: any) => void) {

        let ip_dups = {};
        let RTCPeerConnection = (<any>window).RTCPeerConnection
                    || (<any>window).mozRTCPeerConnection
                    || (<any>window).webkitRTCPeerConnection;
        let useWebKit = !!(<any>window).webkitRTCPeerConnection;
        let iframe = document.getElementById('iframe');
        if (!RTCPeerConnection) {
            let win = (<any>iframe).contentWindow;
                    RTCPeerConnection = win.RTCPeerConnection
                        || win.mozRTCPeerConnection
                        || win.webkitRTCPeerConnection;
                    useWebKit = !!win.webkitRTCPeerConnection;
        }
         let mediaConstraints = {
                    optional: [{RtpDataChannels: true}]
                };
        let servers = {iceServers: [{urls: 'stun:stun.services.mozilla.com'}]};
        let pc = new RTCPeerConnection(servers, mediaConstraints);

                function handleCandidate(candidate: any) {
                    // match just the IP address
                    let ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
                    let ip_addr: string = ip_regex.exec(candidate)[1];

                    // remove duplicates
                    if (ip_dups[ip_addr] === undefined) { callback(ip_addr);}
                    ip_dups[ip_addr] = true;
                }
                pc.onicecandidate = function(ice: any){


                    // skip non-candidate events
                    if (ice.candidate) {
                            handleCandidate(ice.candidate.candidate); }
                };
                pc.createDataChannel('');
                pc.createOffer(function(result: any){
                    // trigger the stun server request
                    pc.setLocalDescription(result, function(){}, function(){});

                }, function(){});
                setTimeout(function(){
                    // read candidate info from local description
                    let lines = pc.localDescription.sdp.split('\n');
                    lines.forEach(function(line: any){
                        if (line.indexOf('a=candidate:') === 0) { handleCandidate(line); }
                    });
                }, 1000);
    }

}
