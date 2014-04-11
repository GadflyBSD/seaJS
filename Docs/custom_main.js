/**
 * Created by Administrator on 14-3-20.
 */
var SeaOptions = ({
	collapseMenu: {parent:'#collapse'},
	collapseMenu1: {parent:'#collapse',ppp:111},
	collapseMenu2: {parent:'#collapse', ppp:222},
	seaSnippet:{style:'ide-eclipse'},
	Dialog:{width:'850px',tmpl:{ordersn:'这里是jQuery TMPL 传递变量'}},
	slider: {
		height:'150px',
		pagination:false,
		transPeriod: 100,
		fx: 'scrollLeft',
		onLoaded: function (index){
			var bgcolor = ['#d4d3ba','#559bb6', '#6e9d2d','#e0d6bb', '#559bb6', '#6e9d2d'];
			$('#sliderDiv').css({'background': bgcolor[index]});
		},
		loader: 'bar'
	},
	CarouFredSel: {
		scroll:{
			onBefore: function(data){
				//var bgcolor = ['#d4d3ba','#559bb6', '#6e9d2d','#e0d6bb', '#559bb6', '#6e9d2d'];
				//$('#sliderDiv').css({'background': bgcolor[index]});
				console.log(data);
			}
		}
	},
	Meerkat :{
		background: '#333',
		height: '150px',
		width: '100%',
		position: 'bottom',
		close: '.close-meerkat',
		animationIn: 'slide',
		animationSpeed: 500
	}
});
function onClick(el, pos, evt){
	changeImage( el, pos );
	evt.preventDefault();
}
function onReady(){
	changeImage( $carouselItems.eq( current ), current );
}