define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'promise', 'ojs/ojtable', 'ojs/ojarraytabledatasource', 'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'service', 'ojs/ojcomponents', 'ojs/ojselectcombobox'],
        function (oj, ko, $)
        {
            function viewModel()
            {
                var self = this;
                var jobId = "";
                self.nameDeferred = ko.observable(false);
                self.jobDescDeferred = ko.observable(false);
                self.jobClassDeferred = ko.observable(false);
                self.numberDeferred = ko.observable(false);
                self.minuteDeferred = ko.observable(false);
                self.hourDeferred = ko.observable(false);
                self.jobDescValue = ko.observable();
                self.jobClassValue = ko.observable();
                self.durationValue = ko.observable('H');
                self.hourDayValue = ko.observable();
                self.isNumberDisable = ko.observable();
                self.hourVal = ko.observable();
                self.minVal = ko.observable();
                self.jobNameValue = ko.observable();
                self.statusVal = ko.observable();
                self.pagingConfigDatasource = ko.observable();
                self.pagingHistoryDatasource = ko.observable();
                self.allHours = ko.observableArray([]);
                self.allMinutes = ko.observableArray([]);
                self.rulesconfigData = ko.observable([]);
                self.placeholdersData = ko.observable([]);
                
                self.searchClick = function (data, event) {
                    self.pagingHistoryDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([], {idAttribute: 'jobHistoryId'})));
                    var jobName = document.getElementById('job_name').value;
                    var jobStatus = self.statusVal();                    
 
                        if (jobName !== null && jobName !== "")
                        {
                            self.pagingConfigDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(concatenateJobFreqFragm(getJobConfigInfo(jobName)), {idAttribute: 'jobId'})));
                        } else
                        {
                            self.pagingConfigDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(concatenateJobFreqFragm(getJobConfigInfo(null)), {idAttribute: 'jobId'})));
                        }
                    
                    return true;
                };

                function concatenateJobFreqFragm(tableArray)
                {
                    var jobConfigsNew = [];
                    for (var idx in tableArray) {
                        var jobConfig = tableArray[idx];
                        var jobFrequency = typeof jobConfig.jobFrequency === "undefined" ? '0' : jobConfig.jobFrequency;
                        var jobFrequencyHour = typeof jobConfig.jobFrequencyHour === "undefined" ? '0' : jobConfig.jobFrequencyHour;
                        var jobFrequencyMinute = typeof jobConfig.jobFrequencyMinute === "undefined" ? '0' : jobConfig.jobFrequencyMinute;
                        var jobFrequencyType=typeof jobConfig.jobFrequencyType === "undefined" ? '0' : jobConfig.jobFrequencyType;
                        console.log("jobFrequencyType::"+jobFrequencyType);
                        if(jobFrequencyType==='D')
                        {
                        jobConfig.jobFreq = pad(jobFrequency) + ' Day ' + pad(jobFrequencyHour) + ' Hours ' + pad(jobFrequencyMinute)+' Minutes';
                        }
                        else if(jobFrequencyType==='H')
                        {
                           jobConfig.jobFreq = pad(jobFrequency) + ' Hour '; 
                        }
                        jobConfigsNew.push(jobConfig);
                    }
                    return jobConfigsNew;
                }

                self.resetClick = function (data, event) {
                    document.getElementById('job_name').value = "";
                    self.statusVal(null);
                    return true;
                };
                refreshConfigTable();
                //self.pagingConfigDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(getJobConfigInfo(null), {idAttribute: 'jobId'})));
                self.handleAttached = function () {
                    $('#jobConfigTable').on('ojoptionchange', selectionListener);
                };

                function selectionListener(event, data)
                {
                    if (data['option'] === 'currentRow')
                    {
                        var selectionObj = data['value'];
                        if (selectionObj !== null)
                        {
                            jobId = selectionObj.rowKey;
                            self.pagingHistoryDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(getJobHistoryByJobId(jobId), {idAttribute: 'jobHistoryId'})));
                        }
                    }
                }
                ;
                function pad(n) {
                    return (n < 10) ? ("0" + n) : n;
                }
                ;
                function removeLeadingZero(val)
                {
                    return val.replace(/^0+/, '');
                }
                function populatePopupByJobId(jobIdParam)
                {
                    var data = [];
                    data = getJobConfigInfo(null);
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].jobId === jobIdParam) {
                            self.jobNameValue(data[i].jobName);
                            self.jobDescValue(data[i].jobDescription);
                            self.jobClassValue(data[i].className);
                            self.durationValue(data[i].jobFrequencyType);
                            self.hourDayValue(data[i].jobFrequency);
                            self.hourVal(data[i].jobFrequencyHour);
                            self.minVal(data[i].jobFrequencyMinute);
                            if ('D' === data[i].jobFrequencyType.toString())
                            {
                                self.isNumberDisable(true);
                                $('#of1').show();
                            } else
                            {
                                self.isNumberDisable(false);
                                $('#of1').hide();
                            }

                        }
                    }
                }
                ;
                function resetPopup()
                {
                    var nameComp =
                            oj.Components.getWidgetConstructor(document.getElementById("name"));
                    nameComp("reset");
                    $('#nameVal').hide();
                    $('#name').parent().removeClass('oj-invalid');
                    var jobDescComp =
                            oj.Components.getWidgetConstructor(document.getElementById("job_description"));
                    jobDescComp("reset");
                    var jobClassComp =
                            oj.Components.getWidgetConstructor(document.getElementById("job_class"));
                    jobClassComp("reset");
                    var numberComp =
                            oj.Components.getWidgetConstructor(document.getElementById("number"));
                    numberComp("reset");
                    var minutesComp =
                            oj.Components.getWidgetConstructor(document.getElementById("minutes"));
                    minutesComp("reset");
                    var hourComp =
                            oj.Components.getWidgetConstructor(document.getElementById("hours"));
                    hourComp("reset");
                }
                ;

                function setHourMinPopup()
                {
                    for (i = 1; i <= 24; i++) {
                        self.allHours.push({value: pad(i), label: pad(i)});
                    }
                    for (i = 1; i <= 60; i++) {
                        self.allMinutes.push({value: pad(i), label: pad(i)});
                    }
                }
                ;
                function clearPopupErrors()
                {
                    $("#name").ojInputText("showMessages");
                    $("#job_description").ojTextArea("showMessages");
                    $("#job_class").ojInputText("showMessages");
                    $("#number").ojCombobox("showMessages");
                    $("#minutes").ojCombobox("showMessages");
                    $("#hours").ojCombobox("showMessages");
                    return true;
                }
                ;
                function refreshConfigTable()
                {
                    self.pagingConfigDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(concatenateJobFreqFragm(getJobConfigInfo(null)), {idAttribute: 'jobId'})));
                }

                function refreshHistoryTable(jobId)
                {
                    if (jobId !== null)
                    {
                        self.pagingHistoryDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(getJobHistoryByJobId(jobId), {idAttribute: 'jobHistoryId'})));
                    } else
                    {
                        self.pagingHistoryDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(getJobHistoryByJobId(null), {idAttribute: 'jobHistoryId'})));
                    }
                }
                self.editRow = function (data, event) {
                    if (jobId !== null && jobId !== "")
                    {
                        $("#jobDialog").ojDialog("open");
                        resetPopup();
                        setHourMinPopup();
                        populatePopupByJobId(jobId);
                    } else
                    {
                        $("#confirmDialog").ojDialog("open");
                        $("#messegeText").text("Please select a row to edit");
                    }
                    return true;
                };
                self.addRow = function (data, event) {
                    jobId = null;
                    $("#jobDialog").ojDialog("open");
                    resetPopup();
                    self.jobNameValue(null);
                    self.jobDescValue(null);
                    self.jobClassValue(null);
                    self.durationValue('H');
                    self.hourDayValue(null);
                    self.hourVal(null);
                    self.minVal(null);
                    setHourMinPopup();
                    return true;
                };
                self.durationChangeHandler = function (context, valueParam) {
                    if (valueParam.option === "value") {
                        var selectedValue = valueParam.value;
                        if ('D' === selectedValue.toString())
                        {
                            self.hourVal(null);
                            self.minVal(null);
                            self.hourDayValue(01);
                            self.isNumberDisable(true);
                            $('#of1').show();
                        } else
                        {
                            self.hourDayValue(null);
                            self.isNumberDisable(false);
                            $('#of1').hide();
                        }
                    }
                };
                self.closePopup = function (data, event) {
                    $("#jobDialog").ojDialog("close");
                    return true;
                };
                self.closeRulesConfigPopup = function (data, event) {
                    $("#ruleDialog").ojDialog("close");
                    return true;
                };
                self.closeConfirmDialog = function (data, event) {
                    $("#confirmDialog").ojDialog("close");
                    $("#messegeText").text("");
                    return true;
                };

                self.saveRunJob = function (data, event) {
                    clearPopupErrors();
                    var jobName = this.jobNameValue();
                    var jobDescription = this.jobDescValue();
                    var className = this.jobClassValue();
                    var jobFrequencyType = this.durationValue();
                    var jobFrequencyHour = null;
                    var jobFrequencyMinute = null;
                    var div2Rendered = false;
                    if (jobFrequencyType[0] === 'D' || jobFrequencyType === 'D')
                    {
                        if (this.hourVal() !== null)
                        {
                            jobFrequencyHour = removeLeadingZero(this.hourVal().toString());
                        }
                        if (this.minVal() !== null)
                        {
                            jobFrequencyMinute = removeLeadingZero(this.minVal().toString());
                        }
                        div2Rendered = true;
                    }
                    var jobFrequency = null;
                    if (typeof this.hourDayValue() !== "undefined" && this.hourDayValue() !== null)
                    {
                        jobFrequency = removeLeadingZero(this.hourDayValue().toString());
                    }
                    var saveRunStatus = 'Running';

                    var isClassExist = false;
                    if (div2Rendered)
                    {
                        $("#jobDialog .oj-invalid").each(function () {
                            isClassExist = true;
                        });
                    } else
                    {
                        $("#div1 .oj-invalid").each(function () {
                            isClassExist = true;
                        });
                    }
                    if (!isClassExist)
                    {
                        if (jobId === null)
                        {
                            var jsonInsertObject = "{\"className\":\"" + className + "\",\"jobDescription\":\"" + jobDescription + "\",\"jobFrequency\":" + jobFrequency + ",\"jobFrequencyHour\":" + jobFrequencyHour + ",\"jobFrequencyMinute\":" + jobFrequencyMinute + ",\"jobFrequencyType\":\"" + jobFrequencyType + "\",\"jobName\":\"" + jobName + "\",\"jobStatus\":\"" + saveRunStatus + "\"}";
                            var jsonInsertData = JSON.parse(jsonInsertObject);
                            insertJobConfigDetails(jsonInsertData);
                        } else
                        {
                            var jobIdGlobal = jobId;
                            var jsonUpdateObject = "{\"className\":\"" + className + "\",\"jobDescription\":\"" + jobDescription + "\",\"jobFrequency\":" + jobFrequency + ",\"jobFrequencyHour\":" + jobFrequencyHour + ",\"jobFrequencyMinute\":" + jobFrequencyMinute + ",\"jobFrequencyType\":\"" + jobFrequencyType + "\",\"jobId\":" + jobIdGlobal + ",\"jobName\":\"" + jobName + "\",\"jobStatus\":\"" + saveRunStatus + "\"}";
                            var jsonUpdateData = JSON.parse(jsonUpdateObject);
                            updateJobConfigDetails(jobIdGlobal, jsonUpdateData);
                        }
                        refreshConfigTable();


                        self.closePopup();
                        $("#confirmDialog").ojDialog("open");
                        $("#messegeText").text("Job has Successully Saved and Started");
                        jobId = null;  //nullify global variable
                    }

                    return true;
                };
                self.save = function (data, event) {
                    clearPopupErrors();
                    var jobName = this.jobNameValue();
                    var jobDescription = this.jobDescValue();
                    var className = this.jobClassValue();
                    var jobFrequencyType = this.durationValue();
                    var jobFrequencyHour = null;
                    var jobFrequencyMinute = null;
                    var div2Rendered = false;
                    if (jobFrequencyType[0] === 'D' || jobFrequencyType === 'D')
                    {
                        if (this.hourVal() !== null)
                        {
                            jobFrequencyHour = removeLeadingZero(this.hourVal().toString());
                        }
                        if (this.minVal() !== null)
                        {
                            jobFrequencyMinute = removeLeadingZero(this.minVal().toString());
                        }
                        div2Rendered = true;
                    }
                    var jobFrequency = null;
                    if (typeof this.hourDayValue() !== "undefined" && this.hourDayValue() !== null)
                    {
                        jobFrequency = removeLeadingZero(this.hourDayValue().toString());
                    }
                    var saveStatus = 'New';
                    var isClassExist = false;
                    if (div2Rendered)
                    {
                        $("#jobDialog .oj-invalid").each(function () {
                            isClassExist = true;
                        });
                    } else
                    {
                        $("#div1 .oj-invalid").each(function () {
                            isClassExist = true;
                        });
                    }
                    if (!isClassExist)
                    {
                        if (jobId === null)
                        {
                            if (jobName != null)
                                checkDuplicateName(jobName);
                            var jsonInsertObject = "{\"className\":\"" + className + "\",\"jobDescription\":\"" + jobDescription + "\",\"jobFrequency\":" + jobFrequency + ",\"jobFrequencyHour\":" + jobFrequencyHour + ",\"jobFrequencyMinute\":" + jobFrequencyMinute + ",\"jobFrequencyType\":\"" + jobFrequencyType + "\",\"jobName\":\"" + jobName + "\",\"jobStatus\":\"" + saveStatus + "\"}";
                            var jsonInsertData = JSON.parse(jsonInsertObject);
                            insertJobConfigDetails(jsonInsertData);

                        } else
                        {
                            var jobIdGlobal = jobId;
                            var jsonUpdateObject = "{\"className\":\"" + className + "\",\"jobDescription\":\"" + jobDescription + "\",\"jobFrequency\":" + jobFrequency + ",\"jobFrequencyHour\":" + jobFrequencyHour + ",\"jobFrequencyMinute\":" + jobFrequencyMinute + ",\"jobFrequencyType\":\"" + jobFrequencyType + "\",\"jobId\":" + jobIdGlobal + ",\"jobName\":\"" + jobName + "\",\"jobStatus\":\"" + saveStatus + "\"}";
                            console.log("Update Operation" + jsonUpdateObject);
                            var jsonUpdateData = JSON.parse(jsonUpdateObject);
                            updateJobConfigDetails(jobIdGlobal, jsonUpdateData);

                        }
                        refreshConfigTable();
                        self.closePopup();
                        $("#confirmDialog").ojDialog("open");
                        $("#messegeText").text("Job has Successully Saved");
                        jobId = null;  //nullify global variable
                    }
                    return true;
                };
     
                self.saveRuleConfig = function (data, event) {
                               
                    var changedValues = [];
                    var retrievedConfigData = getRulesConfigInfoByJobId(jobId);
                    var k =0;
                    var m = 0;
                    var ruleTypesTxt = [];
                    var ruleTypesTxtArea = [];
                    var validationErrors = 0;
                    var textValues = [];
                    var textAreaValues = [];
                    var textUILabels = [];
                    var textAreaUILabels = [];
                
                    
                    for (i=0;i< retrievedConfigData.length;i++){
                        if(retrievedConfigData[i].inputFieldType === 'text')
                        {
                            
                            textUILabels.push(retrievedConfigData[i].uiLabel);
                            ruleTypesTxt.push(retrievedConfigData[i].ruleType);
                        }
                        if(retrievedConfigData[i].inputFieldType === 'textarea')
                        {
                          
                            textAreaUILabels.push(retrievedConfigData[i].uiLabel);
                            ruleTypesTxtArea.push(retrievedConfigData[i].ruleType);
                        }
                                
                    }
                    
                        
                    $("#ruleDialog textarea").each(function() {
                        //alert(this.value);
                        textAreaValues.push(this.value);
                    }); 
                    $("#ruleDialog input[type=text]").each(function() {
                       // alert(this.value);
                        textValues.push(this.value);
                    }); 
                    
                    for(j=0;j<textAreaValues.length;j++){
                        var keyValue = textAreaValues[j];                                     
                        var newKeyValue =  keyValue.replace(new RegExp('</', 'g'), '<%2F');
                        
                        changedValues.push({ui_label : textAreaUILabels[j],key_value:newKeyValue});
                        
                    }
                    for(l=0;l<textValues.length;l++){
                        var keyTxtValue = textValues[l];                                     
                        var newTxtKeyValue =  keyTxtValue.replace(new RegExp('</', 'g'), '<%2F');
                        
                        changedValues.push({ui_label : textUILabels[l],key_value:newTxtKeyValue});
                        
                    }                 
                    
                  
                    
                     $("#ruleDialog input[type=text]").each(function() {
                     // alert(this.value);
                    // check for blank fields 
                    if(!this.value)
                        {
                            alert("This field is required");
                            this.focus();
                        }
                          
                       if(ruleTypesTxt[k] === 'Text')
                       {
                           if(!isNaN(this.value))
                           {
                               alert("Please enter text value");
                               validationErrors = 1;
                               this.focus();
                               
                           }
                           
                       }else if(ruleTypesTxt[k] === 'Number'){
                           
                           if(isNaN(this.value))
                           {
                               alert("Please enter Numeric value");
                               validationErrors = 1;
                               this.focus();
                               
                           }
                           
                       }
 
                         k = k+1;
                       
                    });
                    
                    $("#ruleDialog textarea").each(function(){
                        
                       if(!this.value)
                        {
                            alert("This field is required");
                            this.focus();
                        }
                        if(ruleTypesTxtArea[m] === 'Text')   
                        {
                        if(!isNaN(this.value))
                           {
                               
                               alert("Please enter text value");
                               validationErrors = 1;
                               this.focus();                               
                           }
                       }
                       m = m+1;
                        });

                    if(validationErrors === 0)
                    {updateRuleConfigDetails(jobId,JSON.stringify(changedValues));
                      //location.reload(true);
                      self.closeRulesConfigPopup();
                      $("#confirmDialog").ojDialog("open");
                      $("#messegeText").text("Rule configuration Saved Successully ");
                      return true;
                    }
                     else
                     {
                         return false;
                         
                     }
                };
                
                function checkDuplicateName(jobName)
                {
                    if (getJobConfigInfo(jobName).length > 0)
                    {
                        $('#nameVal').show();
                        $('#name').parent().addClass('oj-invalid');

                    } else
                    {
                        $('#nameVal').hide();
                        $('#name').parent().removeClass('oj-invalid');
                    }
                }
                ;
                function showRulesConfigurations(jobIdParam){
                    
                    console.log("showRulesConfigurations by JobId");
                   
                    var inputTypes = [];
                     self.rulesconfigData([]); 
                     self.placeholdersData([]);
                     var rulecfgData = getRulesConfigInfoByJobId(jobIdParam);
                     var placeholders = getPlaceholdersByJobId(jobIdParam);
                     var k = 0;
                     self.rulesconfigData(rulecfgData);
                     self.placeholdersData(placeholders);   
                     
                     for(j=0;j<rulecfgData.length;j++){
                         inputTypes.push(rulecfgData[j].inputFieldType);
                         
                     }
                          var attrs = {};       
                     $("#ruleDialog input[type=text]").each(function() {

                         if(rulecfgData[k].inputFieldType === 'textarea')
                         { 
                             var style = $(this).attr('style'),
                             textbox  = document.createElement('textarea');
                             textbox.id = 'ruleValue';
                             textbox.cols  = 45;
                             textbox.rows  = 5;
                             textbox.value = this.value; 
                             textbox.required = true;
                             $(this).parent().parent().replaceWith(textbox);
                         }  
                         k = k+1;
                     });
                     
                 }
                    
                self.openDeletePopup = function (data, event) {
                    $("#jobDeleteDialog").ojDialog("open");
                    return true;
                };
                self.deleteRow = function (data, event) {
                    var historydata = [];
                    historydata = getJobHistoryByJobId(jobId);
                    console.log("job history by id:" + JSON.stringify(historydata));
                    for (var i = 0; i < historydata.length; i++) {
                        if (historydata[i].jobHistoryId !== null) {
                            console.log(":::" + JSON.stringify(historydata[i].jobHistoryId));
                            deleteJobHistoryByJobHistoryId(historydata[i].jobHistoryId);
                        }
                    }
                    refreshHistoryTable(null);
                    deleteJobConfigByJobId(jobId);
                    $("#jobDeleteDialog").ojDialog("close");
                    refreshConfigTable();
                    return true;
                };
                self.closeDeletePopup = function (data, event) {
                    $("#jobDeleteDialog").ojDialog("close");
                    return true;
                };
                self.refreshhistory = function (data, event) {
                    console.log("inside refresh val");
                    if (jobId != null)
                    {
                        console.log("jobId val" + jobId);
                        refreshHistoryTable(jobId);
                    } else
                    {
                        refreshHistoryTable(null);
                    }
                    return true;
                };

                self.runJobNow = function (data, event) {
                    if (jobId != null)
                        runJobNow(jobId);
                    $("#confirmDialog").ojDialog("open");
                    $("#messegeText").text("Job has Successully Started");
                    refreshConfigTable();
                    return true;
                };
                self.startJob = function (data, event) {
                    var startStatus = 'Running';
                    updateStatus(startStatus);
                    $("#confirmDialog").ojDialog("open");
                    $("#messegeText").text("Job has Successully Started");
                    refreshConfigTable();
                    return true;
                };
                self.stopJob = function (data, event) {
                    var stopStatus = 'Stopped';
                    updateStatus(stopStatus);
                    $("#confirmDialog").ojDialog("open");
                    $("#messegeText").text("Job has Successully Stopped");
                    refreshConfigTable();
                    return true;
                };
                self.ruleConfig = function (data, event) {
                      if (jobId !== null && jobId !== "")
                    {
                    $("#ruleDialog").ojDialog("open");
                    showRulesConfigurations(jobId);
                    var ruleConfig = self.rulesconfigData();                  

                    } else
                    {
                        $("#confirmDialog").ojDialog("open");
                        $("#messegeText").text("Please select a row to edit rule configuration");
                    }
                    return true;
                };
                
                
                function updateStatus(status)
                {
                    var jobIdGlobal = jobId;
                    var data = [];
                    data = getJobConfigInfo(null);
                    var jobName = null;
                    var jobDescription = null;
                    var className = null;
                    var jobFrequencyType = null;
                    var jobFrequency = null;
                    var jobFrequencyHour = null;
                    var jobFrequencyMinute = null;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].jobId === jobIdGlobal) {
                            jobName = data[i].jobName;
                            jobDescription = data[i].jobDescription;
                            className = data[i].className;
                            jobFrequencyType = data[i].jobFrequencyType;
                            jobFrequency = typeof data[i].jobFrequency === "undefined" ? '0' : data[i].jobFrequency;
                            jobFrequencyHour = typeof data[i].jobFrequencyHour === "undefined" ? '0' : data[i].jobFrequencyHour;
                            jobFrequencyMinute = typeof data[i].jobFrequencyMinute === "undefined" ? '0' : data[i].jobFrequencyMinute;
                        }
                    }
                    var jsonUpdateObject = "{\"className\":\"" + className + "\",\"jobDescription\":\"" + jobDescription + "\",\"jobFrequency\":" + jobFrequency + ",\"jobFrequencyHour\":" + jobFrequencyHour + ",\"jobFrequencyMinute\":" + jobFrequencyMinute + ",\"jobFrequencyType\":\"" + jobFrequencyType + "\",\"jobId\":" + jobIdGlobal + ",\"jobName\":\"" + jobName + "\",\"jobStatus\":\"" + status + "\"}";
                    var jsonUpdateData = JSON.parse(jsonUpdateObject);
                    updateJobConfigDetails(jobIdGlobal, jsonUpdateData);
                    refreshConfigTable();
                }
                
            }
            
            console.log("input name " + $('input[name^="ruleVal"]'));    
            
            
            return new viewModel();
        }               
                
);

