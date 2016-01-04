/**
 * Created by Masoud on 29/08/2014.
 */
$(function() {
    var dialog, form,
// From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
        emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        name = $( "#name" ),
        email = $( "#email" ),
        password = $( "#password" ),
        script = $( "#script" );
        /*allFields = $( [] ).add( name ).add( email ).add( password ),
        tips = $( ".validateTips" );*/
    /*function updateTips( t ) {
        tips
            .text( t )
            .addClass( "ui-state-highlight" );
        setTimeout(function() {
            tips.removeClass( "ui-state-highlight", 1500 );
        }, 500 );
    }
    function checkLength( o, n, min, max ) {
        if ( o.val().length > max || o.val().length < min ) {
            o.addClass( "ui-state-error" );
            updateTips( "Length of " + n + " must be between " +
                min + " and " + max + "." );
            return false;
        } else {
            return true;
        }
    }
    function checkRegexp( o, regexp, n ) {
        if ( !( regexp.test( o.val() ) ) ) {
            o.addClass( "ui-state-error" );
            updateTips( n );
            return false;
        } else {
            return true;
        }
    }*/
    function addHandler() {
        var valid = true;
        //allFields.removeClass( "ui-state-error" );
        /*valid = valid && checkLength( name, "username", 3, 16 );
        valid = valid && checkLength( email, "email", 6, 80 );
        valid = valid && checkLength( password, "password", 5, 16 );
        valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
        valid = valid && checkRegexp( email, emailRegex, "eg. ui@jquery.com" );
        valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );*/
        if ( valid ) {
            localStorage.listenerName = name.val();
            localStorage.email = email.val();
            localStorage.password = password.val();
            localStorage.script = script.val();
            localStorage.hasListener = "true";
            dialog.dialog( "close" );
            location.reload();
        }
        return valid;
    }
    dialog = $( "#dialog-form" ).dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "Create listener":  addHandler,
            Cancel: function() {
                dialog.dialog( "close" );
            }
        },
        close: function() {
            form[ 0 ].reset();
        }
    });
    form = dialog.find( "form" ).on( "submit", function( event ) {
        event.preventDefault();
         addHandler();
    });
    $( "#set-handler" ).on( "click", function() {
        dialog.dialog( "open" );
    });
});