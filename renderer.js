$(function () {

    const {dialog} = require('electron').remote;
    const nconf = require('nconf');
    const fs = require('fs');
    const path = require('path');
    const ejs = require('ejs');
    const pjson = require('./package.json');

    nconf.argv().env().file({file: 'config/config.json'});

    setup();

    function setup() {
        $('.header.row.navi').html(loadTemplate('cmdBox', {}));

        $('footer').prepend('<img src="img/logo.png" height="24px"/> ' + pjson.productName + ' ' + pjson.version + ' - ');

        initContent();

        // Setup buttons
        var cmdBox = $('.cmdBoxNavi');

        cmdBox.find('[data-toggle=config]').on('click', function () {
            showConfig();
        });

        cmdBox.find('[data-toggle=home]').on('click', function () {
            initContent();
        });

        cmdBox.find('[data-toggle=theme]').on('click', function () {
            var e = $('head link#styleSheet');
            if (e.attr('href').indexOf('dark') > 0) {
                e.attr('href', 'css/example.css');
            } else {
                e.attr('href', 'css/example_dark.css');
            }
        });
    }

    /**
     * Load a ejs template.
     *
     * @param name
     * @param object
     *
     * @returns {String}
     */
    function loadTemplate(name, object) {
        var tpl = fs.readFileSync(__dirname + '/partials/' + name + '.ejs');
        return ejs.render(tpl.toString(), object);
    }

    function initContent(message) {
        $('#header').html('<h2><img src="img/logo.png" height="70px"/> ' + pjson.productName + ' <code>' + pjson.version + '</code></h2>');
        $('#content').html('');
        $('#slider').html(loadTemplate('cmdSlider', {o: nconf})).promise().done(function () {
            $('.cmd').on('click', function () {
                $.isLoading({ text: "Loading" });
                var thisId = $(this).data('id');
                var cmdContent = nconf.get('commands')[thisId - 1].content;
                var php = nconf.get('php');
                var artisan = nconf.get('artisan');
                var childProcess = require('child_process');
                var iconv = require('iconv-lite');
                var cmd = php + " " + artisan + " " + cmdContent;
                var exec = childProcess.exec(cmd, {'encoding': nconf.get('charset')}, (error, stdout, stderr) => {
                    if (error) {
                        initContent(loadTemplate('alert', {type: 'danger', message: iconv.decode(error, nconf.get('charset'))}));
                    } else {
                        if (stderr.toString().trim() !== "") {
                            initContent(loadTemplate('alert', {type: 'warning', message: iconv.decode(stderr, nconf.get('charset'))}));
                        }
                        if (stdout.toString().trim() !== "") {
                            initContent(loadTemplate('alert', {type: 'info', message: iconv.decode(stdout, nconf.get('charset'))}));
                        }
                    }
                    $.isLoading( "hide" );
                });
            });
        });
        if (message) {
            $('#console').append(message);
        }
    }

    /**
     * Show the configuration.
     */
    function showConfig() {
        $('#header').html('<h3><img src="img/logo.png" height="70px"/> Configuration</h3>');
        $('#content').html(loadTemplate('configMain', {o: nconf}));
        $('#slider').html(loadTemplate('configSlider', {o: nconf})).promise().done(function () {
            $('[data-toggle="menu"]').menu();
        });
        $('#console').html('');

        $('#btnSaveConfig').on('click', function () {
            saveConfig();
        });

        $('#cfgTheme').on('change', function () {
            var e = $('head link#styleSheet');
            if ('Black' === $(this).val()) {
                e.attr('href', './css/example_dark.css');
            } else {
                e.attr('href', './css/example.css');
            }
        });
    }

    /**
     * Save the configuration.
     */
    function saveConfig() {
        nconf.set('charset', $('#cfgCharset').val());
        nconf.set('php', $('#cfgPhp').val());
        nconf.set('composer', $('#cfgComposer').val());
        nconf.set('artisan', $('#cfgArtisan').val());
        nconf.save();
        initContent(loadTemplate('alert', {type: 'info', message: 'Config saved.'}));
    }
});
