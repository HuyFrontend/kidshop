## Demo Web
- http://baboloo.si/

## Frontend template
  - Default HTML5/CSS3/JavaScript template
  - Technologies used:
    * [Jade](http://jade-lang.com)
    * [Less](http://lesscss.org)
    * [jQuery](http://jquery.com)
    * [Grunt](http://gruntjs.com)
    * [Node.js](http://nodejs.org)

## IDE Configuration
- Open Sublime Text
- Choose Preferences -> Settings - Default
- The number of spaces a tab is considered equal to "tab_size": 2
- Set to true to insert spaces when tab is pressed "translate_tabs_to_spaces": true
- Set to true to removing trailing white space on save "trim_trailing_white_space_on_save": true
- Set to true to ensure the last line of the file ends in a newline character when saving "ensure_newline_at_eof_on_save": true
- Install Package Control for Sublime 3
+ Press Ctrl + '+' , or View/Show console and paste following text
+ Enter
+ Restart Sublime Text
+ Content "[ import urllib.request,os,hashlib; h = '2915d1851351e5ee549c20394736b442' + '8bc59f460fa1548d1514676163dafc88'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by) ]"

## Installation
### Install Node.js
  - Download [Node.js](http://nodejs.org)
  - Ensure you have administrator role when install to set the PATH environment variable

### Install Grunt
  - Open Command Line and run
    * npm install
    * npm install grunt-cli -g

## Development
  - grunt

## Testing
  - grunt test

## Release
  - grunt release

## Documentation
  - grunt doc
