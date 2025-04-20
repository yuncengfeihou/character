// 从 SillyTavern 提供的模块中导入需要用到的全局变量和函数
// 注意路径可能需要根据实际情况微调，但通常 script.js 在根目录
import { this_chid, characters } from "../../../../script.js";
// 也可以保留 getContext 用于获取其他信息，但不再用于获取角色
import { getContext } from "../../../extensions.js";


const extensionName = "character"; // 插件文件夹名称

/**
 * 获取并显示当前加载的角色的核心描述信息。
 */
function displayCharacterInfo() {
    console.log(`[${extensionName}] Button clicked. Attempting to get character info...`);

    // 1. 打印 getContext() 的内容 (用于调试其他信息，非角色获取)
    const context = getContext();
    console.log(`[${extensionName}] Raw context object received:`, context);
    console.dir(context); // 用 dir 可能更清晰

    // 2. 检查 this_chid 是否有效
    console.log(`[${extensionName}] Value of global 'this_chid':`, this_chid);

    // this_chid 是当前角色的索引。它应该是数字类型且 >= 0
    if (typeof this_chid !== 'number' || this_chid < 0) {
        console.warn(`[${extensionName}] 获取角色信息失败：全局变量 'this_chid' 无效或未定义 (value: ${this_chid})。`);
        toastr.warning("当前没有角色被选中，或 'this_chid' 无效。", "获取角色信息失败");
        // 提示用户检查是否已加载角色
        toastr.info("请确保您已在聊天界面加载了一个角色。");
        return;
    }

    // 3. 检查 characters 数组是否存在且 this_chid 是否在范围内
    console.log(`[${extensionName}] Global 'characters' array exists:`, Array.isArray(characters));
    if (!Array.isArray(characters) || this_chid >= characters.length) {
        console.warn(`[${extensionName}] 获取角色信息失败：全局 'characters' 数组不存在或 'this_chid' (${this_chid}) 超出范围 (length: ${characters?.length})。`);
        toastr.error("无法访问角色列表或角色索引无效。", "获取角色信息失败");
        return;
    }

    // 4. 通过索引获取当前角色对象
    const currentCharacter = characters[this_chid];
    console.log(`[${extensionName}] Retrieved character object using characters[this_chid]:`, currentCharacter);

    // 5. 检查获取到的 currentCharacter 对象是否有效
    if (!currentCharacter) {
        console.warn(`[${extensionName}] 获取角色信息失败：characters[${this_chid}] 返回了无效值。`);
        toastr.warning(`无法从 characters 数组中获取索引为 ${this_chid} 的角色。`, "获取角色信息失败");
        return;
    }

    // 6. 检查 currentCharacter.data 是否存在且为对象
    console.log(`[${extensionName}] currentCharacter exists. Checking currentCharacter.data...`);
    console.log(`[${extensionName}] Value of currentCharacter.data:`, currentCharacter.data);
    console.log(`[${extensionName}] Type of currentCharacter.data:`, typeof currentCharacter.data);

    // 根据 characters.js 的分析，核心数据应该在 .data 对象里
    if (!currentCharacter.data || typeof currentCharacter.data !== 'object') {
        console.warn(`[${extensionName}] 获取角色信息失败：currentCharacter 存在，但其 'data' 属性不存在、不是对象或为 null/undefined。`);
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
        // 你可以根据需要从 currentCharacter.data 添加更多字段
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
