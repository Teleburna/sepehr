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
        'password': 'password',
        'handlerName': 'processor name',
        'scriptPath': 'scrpit path',
        'cancel': 'cancel',
        'default': 'default',
        'loading': 'loading',

    });

    $translateProvider.translations('fa', {
        'inbox': 'صندوق دریافت',
        'outbox': 'صندوق ارسال',
        'sending': 'درحال ارسال',
        'setting': 'تنظیمات',
        'reload': 'بارگذاری مججد',
        'select all': 'انتخاب همه',
        'delete': 'حذف',
        'search': 'جستجو',
        'save': 'ذخیره',
        'email': 'ایمیل',
        'password': 'گذرواژه',
        'handlerName': 'نام پردازنده',
        'scriptPath': 'آدرس ',
        'tags': 'کلمات کلیدی',
        'cancel': 'انصراف',
        'default': 'حالت اولیه',
        'loading': 'در حال آماده سازی',

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
