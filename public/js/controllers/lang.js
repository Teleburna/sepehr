sepehr.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
        'inbox': 'inbox',
        'outbox': 'oubox',
        'sending': 'sending',
        'setting': 'setting',
        'reload': 'reload',
        'select all': 'select all',
        'delete': 'delete',
        'search': 'search',
        'save': 'save',
        'email': 'email',
        'tags': 'tags',
        'cancel': 'cancel',
        'default': 'default',

    });

    $translateProvider.translations('fa', {
        'inbox': 'صندوق دریافت',
        'outbox': 'صندوق ارسال',
        'sending': 'درحال ارسال',
        'setting': 'تنظیمات',
        'reload': 'دارگذاری مججد',
        'select all': 'انتخاب همه',
        'delete': 'حذف',
        'search': 'جستجو',
        'save': 'ذخیره',
        'email': 'ایمیل',
        'tags': 'کلمات کلیدی',
        'cancel': 'انصراف',
        'default': 'حالت اولیه',

    });

    $translateProvider.preferredLanguage('fa');
}]);

sepehr.controller('translateController', function ($scope, $translate) {
    $scope.changeLanguage = function (key) {
        $translate.use(key);
        if(key != 'fa'){
        }
    };
});
