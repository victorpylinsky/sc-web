$.namespace('Repo.edit');

Repo.edit.Form = {
    
    init: function(sourcePath) {
        this.sourcePath = sourcePath;
        this.updateFileContent();
    },
    
    /** Updates file content from server
     */
    updateFileContent: function() {
        var self = this;
        
        Repo.locker.Lock.show();
        
        $.ajax({
            type: 'GET',
            url: '/repo/api/content',
            data: { 'path': self.sourcePath },
            success: function(data) {
                Repo.edit.Editor.setValue(data);
            },
            complete: function(data) { 
                Repo.locker.Lock.hide();
            }
        });
    }
}


Repo.edit.Editor = {

    init: function(elementId) {
        var self = this;
        var codeArea = document.getElementById(elementId);
        this.editor = CodeMirror.fromTextArea(codeArea,
            {   lineNumbers:true,
                mode:"scs",
                lineWrapping: false
            });

        $('.editorSettings button').click(function(){
            var state = !$(this).attr("class").match("active");
            var name = $(this).attr("name");
            self.editor.setOption(name, state);
        });

        self.text = "";

        $('.editorViews button').click(function(){
            var isActive = $(this).attr("class").match("active");
            if (isActive) {
                return;
            }

            var name = $(this).attr("name");
            if (name == "code") {
                self.editor.setOption("mode", "scs");
                self.editor.setOption("lineNumbers", true);
                self.editor.setOption("readOnly", false);
                $('.editorSettings').show();
                self.editor.setValue(self.text);
                document.getElementsByClassName("CodeMirror-lines")[0].removeChild(CodeMirror.scnView);
            } else if (name == "preview") {
                self.text = self.editor.getValue();
                self.editor.setOption("mode", "scn");
                self.editor.setOption("readOnly", "nocursor");
                self.editor.setValue("");
                self.editor.setOption("lineNumbers", false);
                $('.editorSettings').hide();
                document.getElementsByClassName("CodeMirror-lines")[0].appendChild(CodeMirror.scnView);
                self.editor.refresh();
            }
        });

        $('#save').click(function () {
            //TODO
        });

        $('#cancel').click(function () {
            //TODO
        });
    },

    setValue: function(data) {
        this.editor.setValue(data);
    },

    getValue: function() {
        this.editor.getValue();
    }
}



