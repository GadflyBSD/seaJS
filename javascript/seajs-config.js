/**
 * Created by Administrator on 14-3-20.
 */
seajs.config({
	alias: {
		jquery:             "Frame/jquery-1.8.3.min.js",
		bootstrap:          "Frame/bootstrap/bootstrap",
		underscore:         "Frame/underscore-min",
		cookie:             "Frame/jquery-cookie",
		linq:               "Frame/jquery.linq.min",
		tmpl:               "Frame/jquery.tmpl.min",
		cufon:              "Frame/cufon-yui",

		community:          "Form/jquery.community",
		NumberPicker:       'Form/dpNumberPicker/jQuery.dpNumberPicker',
		editableBT:         "Form/editable/bootstrap-editable",
		editablePT:         "Form/editable/jquery-editable-poshytip",
		editableUI:         "Form/editable/jqueryui-editable",
		kindeditor:         "Form/kindeditor/kindeditor-min",
		validate:           "Form/validate/jquery.validate.min",
		Validator:          "Form/validate/jquery-methods",
		Switch:             "Form/switch/bootstrap-switch.min",
		SmartWizard:        "Form/SmartWizard/jquery.smartWizard-2.0.min",
		jQselectable:       "Form/jQselectable/jQselectable",
		productSelect:      "Form/productSelect/jquery.productSelect",
		Calendar:           "Form/jquery.custom-form",
		seaKindeditor:      "Form/jquery.custom-form",
		VerifyImg:          "Form/jquery.custom-form",
		seaSmartWizard:     "Form/jquery.custom-form",
		RadioCheckbox:      "Form/jquery.custom-form",
		seaEditable:        "Form/jquery.custom-form",
		seaSwitch:          "Form/jquery.custom-form",

		countDown:          "Effect/sco.countdown",
		easing:             "Effect/jquery.easing.1.3.min",
		jPage:              "Effect/jquery.jPages.min",
		seaSnippet:         "Effect/snippet/jquery.snippet.min",
		InfiniteScroll:    "Effect/jquery.infinitescroll.min",
		textition:          "Effect/textition",
		jQCloud:            "Effect/jQCloud/jqcloud-1.0.4.min",
		Anchor:             "Effect/jquery.custom-effect",
		Collapse:           "Effect/jquery.custom-effect",
		seaPoshyTip:        "Effect/jquery.custom-gallery",
		Shake:              "Effect/jquery.custom-effect",
		Confirm:            "Effect/jquery.custom-effect",
		Turns:              "Effect/jquery.custom-effect",
		seaTextition:       "Effect/jquery.custom-effect",
		seaTree:            "ztree/jquery.seaTree",
		zTreeCore:          "ztree/jquery.ztree.core-3.5.min",
		zTreeExedit:        "ztree/jquery.ztree.exedit-3.5.min",
		zTreeExcheck:       "ztree/jquery.ztree.excheck-3.5.min",
		zTreeExhide:        "ztree/jquery.ztree.exhide-3.5.min",
		zTreeAll:           "ztree/jquery.ztree.all-3.5.min",

		ColorBox:           'Gallery/Colorbox/jquery.colorbox-min',
		catSlider:          'Gallery/catSlider/jquery.catslider',
		seaCamera:          "Gallery/Camera/camera.min",
		carouFredSel:       "Gallery/carouFredSel/jquery.carouFredSel-6.2.1",
		TopAdvertisement:   "Gallery/TopAdvertisement/jquery.TopAdvertisement",
		nivoLightbox:        "Gallery/Lightbox/nivo-lightbox",
		prettyPhoto:        "Gallery/prettyPhoto/jquery.prettyPhoto",
		centerimage:        "Gallery/jquery.centerimage",
		elastislide:        "Gallery/Elastislide/jquery.elastislide",
		IconMenu:           "Gallery/TextIconMenu/jquery.iconmenu",
		stellar:            "Gallery/jquery.stellar.min",
		loadImages:         "Gallery/load-image",
		lazyload:           "Gallery/jquery.lazyload.min",
		seaNivoSlider:      "Gallery/nivo-slider/jquery.nivo.slider",
		seaSlider:          "Gallery/seaSlider/jquery.seaSlider",
		seaStellar:         "Gallery/jquery.custom-gallery",
		seaCarouFredSel:    "Gallery/jquery.custom-gallery",
		seaElastislide:     "Gallery/jquery.custom-gallery",
		seaColorbox:        "Gallery/jquery.custom-gallery",
		seaIconmenu:        "Gallery/jquery.custom-gallery",

		hoverGrid:          "Layout/jquery.hoverGrid",
		jMosaic:            "Layout/jquery.jMosaic",
		Freewall:           "Layout/freewall",
		Meerkat:            "Layout/meerkat/jquery.meerkat.1.3",
		Masonry:            "Layout/jquery.masonry",

		messenger:          "Dialog/messenger/messenger.min",
		artDialog:          "Dialog/artDialog/artDialog",
		ClassyNotty:        "Dialog/ClassyNotty/jquery.classynotty",

		uploadify:          "Upload/uploadify/jquery.uploadify.min",
		seaUploadify:       "Upload/uploadify/handlers",
		SWFupload:          "Upload/swfupload/swfupload",
		seaSWFupload:       "Upload/swfupload/handlers",

		PopCircle:          "Nav/PopCircle/jquery.popcircle.1.0",
		ClassySocial:       "Nav/ClassySocial/jquery.classysocial",
		SmartMenus:         "Nav/SmartMenus/jquery.smartmenus"


	},
	vars: {
		locale:             'zh-CN',
		base:               '/static/javascript/',
		jspath:             '/static/javascript'
	},
	paths:{
		poshytip:           'Effect/poshytip',
		ztree:              'Effect/zTree',
		ui:                 'Frame/ui/'
	},
	charset:                'utf-8'
});