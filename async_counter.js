var Counter = function(num_processes, done) {
	this.done = done;
	this.max = num_processes;
	this.counter = 0;
}

Counter.prototype.count = function() {
	this.counter++;
	if (this.counter == this.max) this.done();
};

module.exports = Counter;