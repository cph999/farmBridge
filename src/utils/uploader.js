export const upload = async (file) => {
    try {
        const body = new FormData();
        body.append('file', file);

        const resp = await fetch('http://localhost:8809/api/uploadFile', {
            method: 'POST',
            body,
        });
        const json = await resp.json();
        console.log('Upload successful:', json.data.url);

        return {
            url: json.data.url,
        };
    } catch (error) {
        console.error('Upload failed:', error);

        // 返回默认图片以避免组件错误
        return {
            url: "https://app102.acapp.acwing.com.cn/media/1729242815102.png",
        };
    }
};