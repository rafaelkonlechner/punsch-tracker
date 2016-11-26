var vue = new Vue({
    el: '#app',
    data: {
        score: 0,
    },
    created: function() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            var self = this;
            $.get("/score", function(data) {
                self.score = data.score;
            });
        },
        incrementScore() {
            var self = this;
            $.ajax({
                url: '/incrementScore',
                type: 'POST',
                contentType: "application/json",
                success: function(data) {
                    self.score = data.score;
                    console.log("Score was incremented");
                }
            });
        },
        decrementScore() {
            var self = this;
            $.ajax({
                url: '/decrementScore',
                type: 'POST',
                contentType: "application/json",
                success: function(data) {
                    self.score = data.score;
                    console.log("Score was decremented");
                }
            });
        }
    }
});
