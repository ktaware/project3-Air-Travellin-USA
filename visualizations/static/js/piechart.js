function main() {	
	var svg = d3.select('svg'),
	width = svg.attr('width'),
	height = svg.attr('height'),
	radius = Math.min(width, height) / 2;
	
	var g = svg.append('g')
			.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
	var color = d3.scaleOrdinal(['#C7CEEA','#B5EAD7','#FFDAC1', '#FF9AA2', ])
	var pie = d3.pie().value(function(d){
		return d.ontime && d.late && d.cancelled
	})
	var path = d3.arc()
			.outerRadius(radius - 20)
			.innerRadius(100);
	var label = d3.arc()
			.outerRadius(radius)
			.innerRadius(radius - 150);
	
	// Fetch jfk_data data
	d3.json('http://127.0.0.1:5000/api/v1.0/jfk_data').then(function(data) {
		console.log(data)
		var arc = g.selectAll('.arc')
		.data(pie(data))
		.enter().append('g')
		.attr('class', 'arc')
		arc.append('path')
			.attr('d', path)
			.attr('fill', function(d){return color(d.data.airline_name);})

		arc.append('text')
			.attr('transform', function(d){return 'translate(' + label.centroid(d) + ')';})
			.text(function(d){return d.data.airline_name});	
		}
	);
}