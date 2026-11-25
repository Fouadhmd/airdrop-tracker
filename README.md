# Airdrop Tracker 🪂

متتبع شخصي لإدارة ومتابعة الإيردروبات (Crypto Airdrops) بواجهة عربية RTL.

## المزايا
- إضافة / تعديل / حذف الإيردروبات
- تتبع الحالة: قيد الانتظار / مؤكد / مستلم / منتهٍ
- قائمة مهام لكل مشروع مع شريط تقدم
- إحصائيات سريعة + فلترة حسب الحالة والشبكة
- حفظ تلقائي في `localStorage`
- تصدير / استيراد JSON
- تصميم داكن احترافي مع أنيميشن GSAP
- ملف واحد ذاتي الاحتواء (`docs/index.html`) يعمل على أي متصفح

## التشغيل محليًا
افتح `docs/index.html` مباشرة في المتصفح، أو شغّل نسخة التطوير:

```bash
npm install
npm run dev
```

## البناء
```bash
npm run build
cp dist/index.html dist/icon.svg dist/manifest.webmanifest dist/sw.js docs/
```
