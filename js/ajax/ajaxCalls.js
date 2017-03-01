/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function getJobConfigUrl(){
    
        return "http://140.86.1.93:80/Scheduler/webresources/";
      //return "http://localhost:7101/Scheduler/webresources/";
}

function getJobConfigInfo(jobName){
    var jobConfigData=[];
    console.log("inside getJobConfigInfo "+jobName);
    var jobConfigUrl= getJobConfigUrl();
    console.log("jobConfigUrl " + getJobConfigUrl());
    if(jobName!==null)
    {
        jobConfigUrl= jobConfigUrl + "oracle.com.quartzjobconfiguration/getjobconfigbyjobname/"+jobName;
        
    }
    else
    {
        jobConfigUrl= jobConfigUrl + "oracle.com.quartzjobconfiguration/";  
    }
    
    
    console.log("jobConfigUrl" + jobConfigUrl);
     $.ajax({
                    url:jobConfigUrl,
                    type: "GET",
                    async: false,
                    crossDomain: true,
                    contentType: 'application/json',
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Access-Control-Allow-Origin", "http://140.86.1.93:80");
                        xhr.setRequestHeader("Access-Control-Allow-Headers", "Origin, GET, options,X-Requested-With, Content-Type, Accept");
                    },
                    success: function (data) {
                        jobConfigData=data;
                        console.log('Response JSON Data - ' + JSON.stringify(data));
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error " + xhr.toString());
                }
            });
                    return jobConfigData;
}

function getJobConfigInfoByStatus(jobName,jobStatus){
    var jobConfigData=[];
    console.log("inside getJobConfigInfo== "+jobName);
    console.log("inside getJobConfigInfo==== "+jobStatus);
    var jobConfigUrl= getJobConfigUrl();;
    if(jobName!==null)
    {
         jobConfigUrl= jobConfigUrl + "oracle.com.quartzjobconfiguration/getjobconfigbyname&status/"+jobName+"/"+jobStatus; 
    }
    else
    {
         jobConfigUrl= jobConfigUrl + "oracle.com.quartzjobconfiguration/getjobconfigbyjobstatus/"+jobStatus;
    }
    
     $.ajax({
                   url:jobConfigUrl,
                    type: "GET",
                    async: false,
                    crossDomain: true,
                    dataType: 'json',
                    headers: {
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    success: function (data) {
                        jobConfigData=data;
                        console.log('Response JSON Data - ' + JSON.stringify(data));
                    }
                });
                    return jobConfigData;
}

function getJobHistoryInfo(){
    var jobHistoryData=[];
     $.ajax({
                    url: getJobConfigUrl() + "oracle.com.quartzjobhistory/",
                    type: "GET",
                    async: false,
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/json'
                    },
                    success: function (data) {
                         for (var i=0; i<data.length; i++) {
                           
                            if (data[i].jobStatus === 'C') {
                                data[i].jobStatus = 'Completed';                              
                                
                            }
                            if (data[i].jobStatus === 'F') {
                                data[i].jobStatus = 'Failed';
                              
                            }
                          }
                        jobHistoryData=data;
                        console.log('Response JSON Data - ' + JSON.stringify(data));
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error " + xhr);
          
                }
                });
                    return jobHistoryData;
}

function getJobHistoryByJobId(JobId){
    var jobHistoryData=[];
     $.ajax({
                    url: getJobConfigUrl() + "oracle.com.quartzjobhistory/gethistorybyjobid/"+JobId,
                    type: "GET",
                    async: false,
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    success: function (data) {
                        for (var i=0; i<data.length; i++) {
                           
                            if (data[i].jobStatus === 'C') {
                                data[i].jobStatus = 'Completed';                              
                                
                            }
                            if (data[i].jobStatus === 'F') {
                                data[i].jobStatus = 'Failed';
                              
                            }
                          }
                        jobHistoryData=data;
                        console.log('Response JSON Data - ' + JSON.stringify(data));
                    }
                });
                    return jobHistoryData;
}

function deleteJobConfigByJobId(JobId){
     $.ajax({
                    url: getJobConfigUrl() + "oracle.com.quartzjobconfiguration/deleteConfigData/"+JobId,
                    type: "DELETE",
                    async: false,
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/json'
                    },
                    success: function (data) {
                        console.log('Response JSON Data - ' + JSON.stringify(data));
                    }
                });
}

function deleteJobHistoryByJobHistoryId(JobHistoryId){
    console.log("Inside deleteJobHistoryByJobHistoryId ::"+JobHistoryId);
     $.ajax({
                    url: getJobConfigUrl() + "oracle.com.quartzjobhistory/"+JobHistoryId,
                    type: "DELETE",
                    async: false,
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/json'
                    },
                    success: function (data) {
                        console.log('Response JSON Data - ' + JSON.stringify(data));
                    }
                });
}

function runJobNow(JobId){
    var jobConfigUrl=getJobConfigUrl();
    
    if(JobId!==null)
    {
        jobConfigUrl= jobConfigUrl + "oracle.com.quartzjobconfiguration/runJobNow/"+JobId;
    }
      $.ajax({
                    url:jobConfigUrl,
                    type: "GET",
                    async: false,
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/json'
                    },
                    success: function (data) {

                    }
                });
}

function updateJobConfigDetails(JobId,jsonData){
     $.ajax({
                    url: getJobConfigUrl() + "oracle.com.quartzjobconfiguration/updateRow/"+JobId,
                    type: "PUT",
                    async: false,
                    crossDomain: true,
                    data: JSON.stringify(jsonData),
                    dataType: "json",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'                        
                    },
                    success: function (data) {
                        console.log('Response JSON Data - ' + JSON.stringify(data));
                    }
                });
}

function insertJobConfigDetails(jsonData){
    console.log("inside insertJobConfigDetails...jsondata.." + JSON.stringify(jsonData));
     $.ajax({
                    url: getJobConfigUrl() + "oracle.com.quartzjobconfiguration",
                    type: "POST",
                    async: false,
                    crossDomain: true,
                    data: JSON.stringify(jsonData),
                    dataType: "json",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                    },
                    success: function (data) {
                        console.log('Response JSON Data - ' + JSON.stringify(data));
                    }
                });
}

function getRulesConfigInfo(){
    var rulesConfigData=[];
     $.ajax({
                    url: getJobConfigUrl() + "oracle.com.ruleconfiguration/",
                    type: "GET",
                    async: false,
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/json'
                    },
                    success: function (data) {                         
                        rulesConfigData=data;
                        console.log('Response JSON Data - ' + JSON.stringify(data));
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error " + xhr);
          
                }
                });
                    return rulesConfigData;
}


function getRulesConfigInfoByJobId(JobId){
    var rulesConfigData=[];
     $.ajax({
                    url: getJobConfigUrl() + "oracle.com.ruleconfiguration/getRulesConfigInfoByJobId/"+JobId,
                    type: "GET",
                    async: false,
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/json'
                    },
                    success: function (data) {                         
                        rulesConfigData=data;
                        console.log('Response JSON Data - ' + JSON.stringify(data));
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error " + xhr);
          
                }
                });
                    return rulesConfigData;
}

function getPlaceholdersByJobId(JobId){
    var rulesConfigData=[];
     $.ajax({
                    url: getJobConfigUrl() + "oracle.com.service.placeholders/getPlaceholdersByJobId/"+JobId,
                    type: "GET",
                    async: false,
                    crossDomain: true,
                    headers: {
                        'Accept': 'application/json'
                    },
                    success: function (data) {                         
                        rulesConfigData=data;
                        console.log('Response JSON Data - ' + JSON.stringify(data));
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error " + xhr);
          
                }
                });
                    return rulesConfigData;
}


function insertRuleConfigDetails(jsonData){
    console.log("inside insertJobConfigDetails...jsondata.." + JSON.stringify(jsonData));
     $.ajax({
                    url: getJobConfigUrl() + "oracle.com.ruleconfiguration",
                    type: "POST",
                    async: false,
                    crossDomain: true,
                    data: JSON.stringify(jsonData),
                    dataType: "json",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                    },
                    success: function (data) {
                        console.log('Response JSON Data - ' + JSON.stringify(data));
                    }
                });
}

function updateRuleConfigDetails(JobId,jsonData){
    console.log("json data" + jsonData);
     $.ajax({
                    url: getJobConfigUrl() + "oracle.com.ruleconfiguration/updateRuleConfigByJobId/"+JobId+"/"+jsonData,
                    type: "POST",
                    async: false,
                    crossDomain: true,
                    data: jsonData,
                    dataType: "json",                     
                    headers: {
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'                        
                    },
                    success: function (data) {
                        console.log('Response JSON Data - ' + jsonData);
                    }
                });
            }