
'use strict';

var keymap = {
	bind: function(fn) {
		Mousetrap.bind(['tab'], function(e) {
			fn.branchNode(e);
			e.preventDefault();
		});

		Mousetrap.bind(['enter'], function(e) {
			fn.setDebugText(1, 'Enter Captured');
			if (fn.isSelectMode()) {
				fn.handleTextSubmit();
			}

			e.preventDefault();
		});

		Mousetrap.bind(['alt+shift+n', 'alt+shift+n'], function(e) {

		});

	}
};

module.exports = keymap;