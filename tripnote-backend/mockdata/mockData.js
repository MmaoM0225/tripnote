const fs = require('fs');

const generateMockData = (count = 1000) => {
    return Array.from({ length: count }, (_, index) => {
        const randomImageHeight = 300 + (index % 3) * 100;
        const imageUrl = `https://picsum.photos/300/${randomImageHeight}?random=${index}`;
        const gender = index % 2 === 0 ? 'men' : 'women';
        const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${index % 50}.jpg`;

        return {
            id: index + 1,
            title: `游记标题 ${index + 1}`,
            user_id: index + 1,
            video_url: '', // 可以根据需要生成视频链接
            content: `这是第 ${index + 1} 篇游记的内容，模拟数据。`,
            view_count: Math.floor(Math.random() * 5000),
            status: 'approved',
            location: '模拟地点',
            season: '春季',
            duration_days: Math.floor(Math.random() * 10) + 1,
            cost: (Math.random() * 5000).toFixed(2),
            is_deleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            image_urls: [imageUrl], // 第一张图用作 cover
            author: {
                id: index + 1,
                nickname: `作者${index + 1}`,
                avatar: avatarUrl
            }
        };
    });
};

const data = generateMockData();

fs.writeFileSync('note_2.json', JSON.stringify(data, null, 2));
console.log('✅ mock note.json 文件已生成');

