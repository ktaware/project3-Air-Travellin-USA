function main() {
	
	var svg = d3.select('svg'),
	width = svg.attr('width'),
	height = svg.attr('height'),
	radius = Math.min(width, height) / 2;
	
	var g = svg.append('g')
			.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
	var color = d3.scaleOrdinal(['#C7CEEA','#B5EAD7','#FFDAC1', '#FF9AA2', ])
	var pie = d3.pie().value(function(d){
		return d.ONTIME && d.LATE && d.CANCELLED
	})
	var path = d3.arc()
			.outerRadius(radius - 20)
			.innerRadius(100);
	var label = d3.arc()
			.outerRadius(radius)
			.innerRadius(radius - 150);
	d3.csv('https://raw.githubusercontent.com//rizwanzahid710/data/main/airline/JFK_data.csv').then(
		function(data){
        console.log(data)
		var arc = g.selectAll('.arc')
		.data(pie(data))
		.enter().append('g')
		.attr('class', 'arc')
		arc.append('path')
			.attr('d', path)
			.attr('fill', function(d){return color(d.data.AIRLINE);})

		arc.append('text')
			.attr('transform', function(d){return 'translate(' + label.centroid(d) + ')';})
			.text(function(d){return d.data.AIRLINE});
	
		}
	);
}