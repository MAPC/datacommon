if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
            value: function(search, pos) {
                        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
                    }
        });
}
