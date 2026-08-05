const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    PermissionsBitField
} = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
// ====================== قاعدة كبيرة جداً ======================
const BASE_WORDS = [
    // إنجليزي
    "fuck", "fucker", "fucking", "motherfucker", "mf", "shit", "sh!t", "sh1t", "asshole", "a55hole", "bitch", "b!tch", "b1tch", "cunt", "c*nt", "dick", "d!ck", "pussy", "pu55y", "cock", "c0ck", "nigger", "nigga", "n!gga", "n!gger", "n!gg@", "retard", "faggot", "f4ggot", "whore", "slut", "cocksucker", "dickhead", "bastard", "wanker", "prick", "twat", "bollocks", "piss", "cum", "cumming", "cumshot", "porn", "porno", "sex", "seggs", "s3x", "p0rn",
    // عربي + فرانكو
    "كسم", "كس", "زب", "طيز", "شرموط", "متناك", "منيوك", "قحب", "عاهر", "معرص", "عرص", "مغرص", "خول", "خولة", "خولات", "متخولن", "معرصن", "متشرمط", "قحاب", "قحبات", "مقاحيب", "مركوب", "انيك", "جلخ", "مص", "داعر", "زاني", "كحب", "كحبه", "كحبة",
    "شرموطة", "sharmota", "sharmoota", "sh@rmoot", "sharm00t", "sharm0t",
    "متناك", "متناكه", "متناكة", "ميتناك", "متناق", "متناقة", "متناقه", "مtناك", "متnاك", "متنaك", "متناk",
    "كحبه", "ءحبه", "قحبه", "ئحبه", "معرص", "م3رص", "ma3rs", "m3rs", "m3r5", "معــرص", "مـعرص",
    "خول", "5wl", "khwl", "خwل", "5ول", "خولنه", "كس5تك", "ksختك", "ksk", "kosk", "k0sk", "k0smk", "ks5tk", "kos5tk", "kسختك",
    "عاهrة", "عاهrه", "Metnaك", "طيzك", "يبن المتناkه", "3rص", "عrص", "كصمك", "قصمك", "قصمق", "كصمق", "مقثمك", "قثمك", "كثمك", "كثمق", "قثمق", "زاnي", "Zany", "Zنا", "زنa", "تنيكك", "شرم9ط",
    "خوl", "مخنث", "مخنs", "ديوث", "ديوs", "dios", "m5ns", "مخنص", "م5نث", "mخنث", "ديoث", "dيوث",
    "بضان", "بض*ن", "خصاوي", "خصية", "خصي", "مخصي", "nek", "نeك", "نيk", "nيك", "الزبر", "بالزبر", "احبه",
    // الكلمات الجديدة
    "كيسمك", "كيثمك", "كيصمك", "قيسمك", "قيثمك", "قيصمك", "كيسمق", "قيسمق", "قيثمق", "كيثمق", "كيصمق", "قيصمق",
    "قوسمك", "كوصمك", "قوصمك", "قوثمك", "كوثمك", "كوسمك", "كتفمك", "كشمك", "كتمك", "كتك",
    "كوسختك", "كوصتخك", "كص", "كث", "قوسختك", "قوصختك",
    "ksomk", "3لق", "k$omk", "k$mk", "k$k", "زان", "zani", "zwany", "shrmot",
    "kso5tk", "ksokhtk", "ksom", "كسومك", "كثومك", "كثمك", "كسوختك", "كسوخت", "كسها", "كثها", "يكس", "يكسها", "يكثها"
];
function generateVariations(word) {
    const vars = new Set([word.toLowerCase(), word]);
    const leetMap = { 'a':'4', 'e':'3', 'i':'1', 'o':'0', 't':'7', 's':'5', 'b':'8', 'k':'x', 'ع':'3', 'ص':'s', 'ر':'r', 'ح':'7', 'خ':'5' };
    let leet = word;
    Object.keys(leetMap).forEach(k => leet = leet.replace(new RegExp(k, 'gi'), leetMap[k]));
    vars.add(leet);
    const last = word.slice(-1);
    vars.add(word + last);
    vars.add(word + last.repeat(2));
    vars.add(word + last.repeat(3));
    vars.add(word.split('').join(' '));
    vars.add(word.split('').join('ـ'));
    vars.add(word.split('').join('-'));
    vars.add(word.replace(/ /g, ''));
    const prefixes = ['ه', 'ا', 'ي', 'و', 'ب', 'م', 'ك', 'ف', 'ل', 'x', 'z', 'c', 'يا', 'ابن'];
    const suffixes = ['ه', 'ا', 'ي', 'ة', 'و', 'x', 'z', 'ه', 'ة'];
    prefixes.forEach(p => vars.add(p + word));
    suffixes.forEach(s => vars.add(word + s));
    if (word.includes('معرص') || word.includes('عرص')) {
        vars.add('m3rs'); vars.add('ma3rs'); vars.add('m3r5');
        vars.add('مـعرص'); vars.add('معــرص');
    }
    if (word.includes('كحب') || word.includes('k7ba')) {
        vars.add('k7ba'); vars.add('87ba'); vars.add('kحبه'); vars.add('ءحبه');
    }
    if (word.includes('كس')) vars.add(word.replace('كس', 'ks'));
    return Array.from(vars);
}
// توليد
let BANNED_WORDS = [];
BASE_WORDS.forEach(w => BANNED_WORDS.push(...generateVariations(w)));
BANNED_WORDS = [...new Set(BANNED_WORDS)];
console.log(`[✅] تم توليد ${BANNED_WORDS.length} كلمة`);
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.member && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return;
    }
    const content = message.content.toLowerCase();
    const words = content.split(/\s+/); // تقسيم الرسالة لكلمات
    // البحث عن كلمة ممنوعة كاملة
    const foundWord = BANNED_WORDS.find(banned =>
        words.some(word => word === banned.toLowerCase())
    );
    if (foundWord) {
        await message.delete().catch(() => {});
        const logChannel = message.guild.channels.cache.find(c => c.name === 'baraa-logs');
        if (logChannel) {
            await logChannel.send({ embeds: [new EmbedBuilder()
                .setTitle('⚠️ محاولة شتيمة')
                .setColor('#ED4245')
                .addFields(
                    { name: '👤 العضو', value: `<@${message.author.id}>`, inline: true },
                    { name: '📍 الروم', value: `<#${message.channel.id}>`, inline: true },
                    { name: '🚫 الكلمة الممنوعة', value: `\`${foundWord}\``, inline: true },
                    { name: '📝 الرسالة', value: `\`\`\`${message.content}\`\`\`` }
                )
                .setTimestamp()] });
        }
    }
});
client.on('guildCreate', async (guild) => {
    console.log(`[+] دخلت سيرفر: ${guild.name}`);
    try {
        let logChannel = guild.channels.cache.find(c => c.name === 'baraa-logs');
        if (!logChannel) {
            logChannel = await guild.channels.create({ name: 'baraa-logs', reason: 'Baraa AutoMod Logs' });
        }
        await logChannel.send({ embeds: [new EmbedBuilder()
            .setTitle('🛡️ Baraa AutoMod مفعل')
            .setDescription('تم تفعيل نظام الحماية!')
            .setColor('#5865F2')
            .setTimestamp()] });
    } catch (e) {}
});
client.on('ready', () => console.log(`✅ Baraa AutoMod جاهز`));
client.login(process.env.TOKEN);
