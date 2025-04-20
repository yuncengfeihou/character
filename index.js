// 从 SillyTavern 提供的模块中导入 getContext 函数
import { getContext } from "../../../extensions.js";



const extensionName = "character"; // 插件文件夹名称

/**
 * 获取并显示当前加载的角色的核心描述信息。
 */
function displayCharacterInfo() {
    console.log(`[${extensionName}] Button clicked. Attempting to get character info...`); // 日志：函数开始执行

    // 1. 获取上下文
    const context = getContext();

    // 2. 详细日志：打印整个 context 对象，检查其内容
    console.log(`[${extensionName}] Raw context object received:`, context);
    // 使用 console.dir 可以更好地在某些浏览器中查看对象结构
    console.dir(context);

    // 3. 检查 context 是否有效
    if (!context) {
        console.error(`[${extensionName}] 获取角色信息失败：getContext() 返回了无效值 (null, undefined, etc.).`);
        toastr.error("无法获取应用上下文。", "获取角色信息失败");
        return;
    }

    // 4. 尝试访问 context.character
    const currentCharacter = context.character;
    console.log(`[${extensionName}] Value of context.character:`, currentCharacter);

    // 5. 检查 currentCharacter 是否存在
    if (!currentCharacter) {
        const availableKeys = Object.keys(context);
        console.warn(`[${extensionName}] 获取角色信息失败：context.character 不存在或为 null/undefined。`);
        console.log(`[${extensionName}] 上下文中可用的键：`, availableKeys); // 日志：打印 context 对象的所有键名
        toastr.warning("当前没有角色被加载，或在上下文中未找到角色对象。", "获取角色信息失败");
        // 提示用户检查是否已加载角色
        toastr.info("请确保您已在聊天界面加载了一个角色。");
        return;
    }

    // 6. 检查 currentCharacter.data 是否存在且为对象
    //    (因为根据 characters.js, .data 应该是个对象)
    console.log(`[${extensionName}] currentCharacter exists. Checking currentCharacter.data...`);
    console.log(`[${extensionName}] Value of currentCharacter.data:`, currentCharacter.data);
    console.log(`[${extensionName}] Type of currentCharacter.data:`, typeof currentCharacter.data);

    if (!currentCharacter.data || typeof currentCharacter.data !== 'object') {
        console.warn(`[${extensionName}] 获取角色信息失败：currentCharacter 存在，但其 'data' 属性不存在、不是对象或为 null/undefined。`);
        // 日志：打印 character 对象，检查其内部结构
        console.log(`[${extensionName}] Current character object (inspect structure):`, currentCharacter);
        toastr.warning("角色数据 (data 属性) 不完整或格式错误，无法提取核心信息。", "获取角色信息失败");
        return;
    }

    // 7. 如果一切正常，提取并打印信息
    console.log(`[${extensionName}] Character and character.data seem valid. Extracting core info...`);
    const coreInfo = {
        name: currentCharacter.data.name,
        description: currentCharacter.data.description,
        personality: currentCharacter.data.personality,
        scenario: currentCharacter.data.scenario,
        first_mes: currentCharacter.data.first_mes,
        mes_example: currentCharacter.data.mes_example
    };

    console.log(`[${extensionName}] 当前加载的角色核心信息:`);
    console.log(`  - 名称 (name):`, coreInfo.name);
    console.log(`  - 描述 (description):`, coreInfo.description);
    console.log(`  - 性格 (personality):`, coreInfo.personality);
    console.log(`  - 场景 (scenario):`, coreInfo.scenario);
    console.log(`  - 开场白 (first_mes):`, coreInfo.first_mes);
    console.log(`  - 对话示例 (mes_example):`, coreInfo.mes_example);

    toastr.success(`已获取角色 '${coreInfo.name || '未知名称'}' 的信息，详情请查看控制台 (F12)。`, "角色信息");
}

// 使用 jQuery 的入口函数，确保在文档加载完成后执行
jQuery(async () => {
    // 创建一个简单的 HTML 结构，包含一个按钮
    const settingsHtml = `<div class="${extensionName}-settings">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>获取角色信息插件</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <div class="${extensionName}_block flex-container">
                    <input id="get_character_info_button" class="menu_button" type="submit" value="获取当前角色信息" />
                </div>
                <hr class="sysHR" />
            </div>
        </div>
    </div>`;

    // 将 HTML 添加到 Silly Tavern 的扩展设置页面
    $("#extensions_settings").append(settingsHtml);

    // 获取按钮元素并为其绑定点击事件处理函数
    $("#get_character_info_button").on("click", displayCharacterInfo);

    // 日志：确认插件 UI 已加载
    console.log(`[${extensionName}] Plugin UI added to settings page.`);
});
