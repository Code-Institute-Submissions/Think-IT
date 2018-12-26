function makeGraphs(e,t){var o=crossfilter(t);t.forEach(function(e){e.earned=parseInt(e.earned),e.lost=parseInt(e.lost),e.leads=parseInt(e.leads),e.appointments=parseInt(e.appointments)}),show_store_location_selector(o),show_grand_totals(o),show_group_averages(o),show_amount_earned_per_store(o),show_percent_lost(o),show_leads_and_appts_per_store(o),show_average_leads_to_appts(o),dc.renderAll()}queue().defer(d3.csv,"data/sales-data.csv").await(makeGraphs);var barChartColour="#77cfc9",appointmentsColour="#4F5D75",failColour="#c83524",passColour="#7caf1f";function show_store_location_selector(e){var t=e.dimension(dc.pluck("store_location")),o=t.group();dc.selectMenu("#store-location-selector").dimension(t).group(o).title(function(e){return"State: "+e.key+" | Employees: "+e.value})}function show_grand_totals(e){var t=e.dimension(dc.pluck("month")),o=t.group().reduceSum(dc.pluck("earned")),n=t.group().reduceSum(dc.pluck("lost")),r=t.group().reduceSum(dc.pluck("leads")),a=t.group().reduceSum(dc.pluck("appointments"));dc.numberDisplay("#lost-by-month").formatNumber(d3.format("$.2")).group(n),dc.numberDisplay("#earn-by-month").formatNumber(d3.format("$.2")).group(o),dc.numberDisplay("#leads-by-month").formatNumber(d3.format(".2")).group(r),dc.numberDisplay("#appts-by-month").formatNumber(d3.format(".2")).group(a)}function show_group_averages(e){var t=e.dimension(dc.pluck("month")),o=t.group().reduce(function(e,t){return e.count++,e.leads+=t.leads,e.appts+=t.appointments,e.percent=e.appts/e.leads*100,e},function(e,t){return e.count--,0==e.count?(e.leads=0,e.appts=0,e.percent=0):(e.leads-=t.leads,e.appts-=t.appointments,e.percent=e.appts/e.leads*100),e},function(){return{count:0,leads:0,appts:0,percent:0}}),n=t.group().reduce(function(e,t){return e.count++,e.earned+=t.earned,e.lost+=t.lost,e.total=e.lost/e.earned*100,e},function(e,t){return e.count--,0==e.count?(e.earned=0,e.lost=0):(e.earned-=t.earned,e.lost-=t.lost,e.total=e.lost/e.earned*100),e},function(){return{count:0,earned:0,lost:0,total:0}});dc.numberDisplay("#leads-to-appts-by-month").formatNumber(d3.format(".0%")).group(o).valueAccessor(function(e){return e.value.percent.toFixed(0)/100}),dc.numberDisplay("#percent-lost-by-month").formatNumber(d3.format(".0%")).group(n).valueAccessor(function(e){return e.value.total.toFixed(0)/100})}function show_amount_earned_per_store(e){var t=e.dimension(dc.pluck("store_location")),o=t.group().reduce(function(e,t){return e.count++,e.total+=t.earned-t.lost,e.average=e.total/e.count,e},function(e,t){return e.count--,0==e.count?(e.total=0,e.average=0):(e.total-=t.earned-t.lost,e.average=e.total/e.count),e},function(){return{count:0,total:0,average:0}});dc.barChart("#amount-gained-lost-per-store").width(800).height(600).margins({top:20,right:20,bottom:50,left:60}).dimension(t).group(o).valueAccessor(function(e){return e.value.average.toFixed(2)}).transitionDuration(1e3).x(d3.scale.ordinal()).colors([barChartColour]).y(d3.scale.linear().domain([5e3,26e3])).xUnits(dc.units.ordinal).elasticY(!1).renderHorizontalGridLines(!0).renderTitle(!0).title(function(e){return["Average earned per person in "+e.key+"  is $"+e.value.average.toFixed(2)]}).xAxisLabel("State").yAxisLabel("Average amount earned per person").yAxis().tickFormat(function(e){return"$"+e})}function show_percent_lost(e){var t=e.dimension(dc.pluck("store_location")),o=t.group().reduce(function(e,t){return e.count++,e.earned+=t.earned,e.lost+=t.lost,e.total=e.lost/e.earned*100,e},function(e,t){return e.count--,0==e.count?(e.earned=0,e.lost=0,e.total=0):(e.earned-=t.earned,e.lost-=t.lost,e.total=e.lost/e.earned*100),e},function(){return{count:0,earned:0,lost:0,total:0}});dc.pieChart("#percent-lost").width(400).height(350).radius(100).dimension(t).group(o).valueAccessor(function(e){return 0==e.count?0:e.value.total.toFixed(0)}).innerRadius(40).externalLabels(50).title(function(e){return["Average percent lost in "+e.key+"  is "+e.value.total.toFixed(0)+"%"]}).transitionDuration(1e3).colorAccessor(function(e){return 25<e.value.total?"above_threshold":"below_threshold"}).colors(d3.scale.ordinal().domain(["above_threshold","below_threshold"]).range([failColour,passColour])).minAngleForLabel(0)}function show_leads_and_appts_per_store(e){var t=e.dimension(dc.pluck("store_location")),o=t.group().reduceSum(dc.pluck("leads")),n=t.group().reduceSum(dc.pluck("appointments"));dc.barChart("#leads-and-appts-per-store").width(800).height(500).margins({top:30,right:160,bottom:50,left:50}).dimension(t).group(o,"Total leads").stack(n,"Total appointments").legend(dc.legend().x(670).y(280).itemHeight(10).gap(5)).transitionDuration(1e3).x(d3.scale.ordinal()).ordinalColors([barChartColour,appointmentsColour]).y(d3.scale.linear().domain([5e3,26e3])).xUnits(dc.units.ordinal).elasticY(!0).renderHorizontalGridLines(!0).title(function(e){return["Total generated in "+e.key+"  is "+e.value]}).xAxisLabel("State").yAxisLabel("Leads and appointments generated").yAxis().tickFormat(function(e){return e})}function show_average_leads_to_appts(e){var t=e.dimension(dc.pluck("store_location")),o=t.group().reduce(function(e,t){return e.count++,e.leads+=t.leads,e.appts+=t.appointments,e.percent=e.appts/e.leads*100,e},function(e,t){return e.count--,0==e.count?(e.leads=0,e.appts=0,e.percent=0):(e.leads-=t.leads,e.appts-=t.appointments,e.percent=e.appts/e.leads*100),e},function(){return{count:0,leads:0,appts:0,percent:0}});dc.pieChart("#leads-to-appts").width(325).height(300).radius(100).dimension(t).group(o).valueAccessor(function(e){return 0==e.count?0:e.value.percent}).innerRadius(40).externalLabels(40).title(function(e){return["Average leads to appointments in "+e.key+"  is "+e.value.percent.toFixed(0)+"%"]}).transitionDuration(1e3).colorAccessor(function(e){return e.value.percent<40?"above_threshold":"below_threshold"}).colors(d3.scale.ordinal().domain(["above_threshold","below_threshold"]).range([failColour,passColour])).minAngleForLabel(0)}