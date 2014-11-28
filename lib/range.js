



RubyJS.Range = (function(_super) {
	__extends(Range, _super);

	Range.include(R.Enumerable);

	Range["new"] = function(start, end, exclusive) {
		if (exclusive == null) {
			exclusive = false;
		}
		return new R.Range(start, end, exclusive);
	};

	function Range(start, end, exclusive) {
		var err;
		this.exclusive = exclusive != null ? exclusive : false;
		this.__start__ = this.box(start);
		this.__end__ = this.box(end);
		if (!((this.__start__.is_fixnum != null) && (this.__end__.is_fixnum != null))) {
			try {
				if (this.__start__.cmp(this.__end__) === null) {
					throw R.ArgumentError["new"]();
				}
			} catch (_error) {
				err = _error;
				throw R.ArgumentError["new"]();
			}
		}
		this.comparison = this.exclusive ? 'lt' : 'lteq';
	}

	Range.prototype.is_range = function() {
		return true;
	};

	Range.prototype.iterator = function() {
		var arr;
		arr = [];
		this.each(function(e) {
			return arr.push(e);
		});
		return arr;
	};

	Range.prototype.equals = function(other) {
		if (!(other instanceof R.Range)) {
			return false;
		}
		return this.__end__.equals(other.end()) && this.__start__.equals(other.start()) && this.exclusive === other.exclude_end();
	};

	Range.prototype.begin = function(obj) {
		return this.__start__;
	};

	Range.prototype.cover = function(obj) {
		if (arguments.length !== 1) {
			throw R.ArgumentError["new"]();
		}
		obj = obj;
		if (obj === null) {
			return false;
		}
		return this.equal_case(obj);
	};

	Range.prototype['==='] = function(other) {
		var e, s;
		other = R(other);
		s = other.cmp(this.__start__);
		e = other.cmp(this.__end__);
		if (s === null && e === null) {
			return false;
		}
		s = -s;
		e = -e;
		return s <= 0 && (this.exclusive ? e > 0 : e >= 0);
	};

	Range.prototype.each = function(block) {
		var iterator;
		if (!(block && (block.call != null))) {
			return this.to_enum('each');
		}
		if (this.begin().succ == null) {
			throw R.TypeError["new"]("can't iterate from " + (this.begin()));
		}
		iterator = this.__start__.dup();
		while (iterator[this.comparison](this.__end__)) {
			block(iterator.valueOf());
			iterator = iterator.succ();
		}
		return this;
	};

	Range.prototype.end = function() {
		return this.__end__;
	};

	Range.prototype.exclude_end = function() {
		return this.exclusive;
	};

	Range.prototype.first = function(n) {
		return this.begin();
	};

	Range.prototype.inspect = function() {
		var sep;
		sep = this.exclude_end() ? "..." : "..";
		return "" + (this.start().inspect()) + sep + (this.end().inspect());
	};

	Range.prototype.min = function(block) {
		var b, e;
		if ((block != null ? block.call : void 0) != null) {
			return R.Enumerable.prototype.min.call(this, block);
		}
		b = this.begin();
		e = this.end();
		if (e['lt'](b) || (this.exclusive && e.equals(b))) {
			return null;
		}
		if (b.is_float != null) {
			return b.valueOf();
		}
		return R.Enumerable.prototype.min.call(this);
	};

	Range.prototype.max = function(block) {
		var b, e;
		if ((block != null ? block.call : void 0) != null) {
			return R.Enumerable.prototype.max.call(this, block);
		}
		b = this.begin();
		e = this.end();
		if (e['lt'](b) || (this.exclusive && e.equals(b))) {
			return null;
		}
		if ((e.is_float != null) || ((e.is_float != null) && !this.exclusive)) {
			return e.valueOf();
		}
		return R.Enumerable.prototype.max.call(this);
	};

	Range.prototype.start = function() {
		return this.__start__;
	};

	Range.prototype.step = function(step_size, block) {
		var cmp, cnt, first, last;
		if (step_size == null) {
			step_size = 1;
		}
		if (arguments.length === 1 && (step_size.call != null)) {
			block = step_size;
			step_size = 1;
		}
		if (!(block && (block.call != null))) {
			return this.to_enum('step', step_size);
		}
		step_size = R(step_size);
		first = this.begin();
		last = this.end();
		if (((step_size != null ? step_size.is_float : void 0) != null) || (first.is_float != null) || (last.is_float != null)) {
			step_size = step_size.to_f();
			first = first.to_f();
			last = last.to_f();
		} else {
			step_size = RCoerce.to_int_native(step_size);
		}
		if (step_size <= 0) {
			if (step_size < 0) {
				throw R.ArgumentError["new"]();
			}
			throw R.ArgumentError["new"]();
		}
		cnt = first;
		cmp = this.exclude_end() ? 'lt' : 'lteq';
		if (first.is_float != null) {
			while (cnt[cmp](last)) {
				block(cnt.valueOf());
				cnt = cnt.plus(step_size);
			}
		} else if (first.is_fixnum != null) {
			while (cnt[cmp](last)) {
				block(cnt.valueOf());
				cnt = cnt.plus(step_size);
			}
		} else {
			cnt = 0;
			this.each(function(o) {
				if (cnt % step_size === 0) {
					block(o);
				}
				return cnt += 1;
			});
		}
		return this;
	};

	Range.prototype.to_a = function() {
		if ((this.__end__.is_float != null) && (this.__start__.is_float != null)) {
			throw R.TypeError["new"]();
		}
		return R.Enumerable.prototype.to_a.apply(this);
	};

	Range.prototype.to_s = Range.prototype.inspect;

	Range.__add_default_aliases__(Range.prototype);

	Range.prototype.eql = Range.prototype.equals;

	Range.prototype.include = Range.prototype['==='];

	Range.prototype.last = Range.prototype.end;

	Range.prototype.member = Range.prototype.include;

	Range.prototype.excludeEnd = Range.prototype.exclude_end;

	return Range;

})(RubyJS.Object);

