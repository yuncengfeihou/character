// 从 SillyTavern 提供的模块中导入需要用到的全局变量和函数
import { this_chid, characters } from "../../../../script.js";
// 导入 toastr 用于显示提示信息 (可选，但方便反馈)
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
    console.dir(context);

    // 2. 检查 this_chid 是否有效 (注意：this_chid 是字符串类型!)
    console.log(`[${extensionName}] Value of global 'this_chid':`, this_chid);
    console.log(`[${extensionName}] Type of global 'this_chid':`, typeof this_chid);

    // 修正检查：this_chid 应该是代表非负整数的字符串，或者 undefined
    const isValidChidString = typeof this_chid === 'string' && !isNaN(Number(this_chid)) && Number(this_chid) >= 0;

    if (!isValidChidString) {
        console.warn(`[${extensionName}] 获取角色信息失败：全局变量 'this_chid' 无效或未定义 (value: ${this_chid}, type: ${typeof this_chid})。`);
        toastr.warning("当前没有角色被选中，或 'this_chid' 无效。", "获取角色信息失败");
        toastr.info("请确保您已在聊天界面加载了一个角色。");
        return;
    }

    // 将 this_chid 转换为数字以便用作索引
    const characterIndex = Number(this_chid);
    console.log(`[${extensionName}] Converted 'this_chid' to number:`, characterIndex);

    // 3. 检查 characters 数组是否存在且 characterIndex 是否在范围内
    console.log(`[${extensionName}] Global 'characters' array exists:`, Array.isArray(characters));
    if (!Array.isArray(characters) || characterIndex >= characters.length) {
        console.warn(`[${extensionName}] 获取角色信息失败：全局 'characters' 数组不存在或索引 (${characterIndex}) 超出范围 (length: ${characters?.length})。`);
        toastr.error("无法访问角色列表或角色索引无效。", "获取角色信息失败");
        return;
    }

    // 4. 通过索引获取当前角色对象
    const currentCharacter = characters[characterIndex];
    console.log(`[${extensionName}] Retrieved character object using characters[${characterIndex}]:`, currentCharacter);

    // 5. 检查获取到的 currentCharacter 对象是否有效
    if (!currentCharacter) {
        console.warn(`[${extensionName}] 获取角色信息失败：characters[${characterIndex}] 返回了无效值。`);
        toastr.warning(`无法从 characters 数组中获取索引为 ${characterIndex} 的角色。`, "获取角色信息失败");
        return;
    }

    // 6. 检查 currentCharacter.data 是否存在且为对象
    console.log(`[${extensionName}] currentCharacter exists. Checking currentCharacter.data...`);
    console.log(`[${extensionName}] Value of currentCharacter.data:`, currentCharacter.data);
    console.log(`[${extensionName}] Type of currentCharacter.data:`, typeof currentCharacter.data);

    // 根据 characters.js 的分析，核心数据应该在 .data 对象里
    if (!currentCharacter.data || typeof currentCharacter.data !== 'object') {
        // 尝试从根级获取（兼容旧格式或浅层加载？）
        const coreInfoFallback = {
             name: currentCharacter.name,
             description: currentCharacter.description,
             personality: currentCharacter.personality,
             scenario: currentCharacter.scenario,
             first_mes: currentCharacter.first_mes,
             mes_example: currentCharacter.mes_example
        };
        if (coreInfoFallback.name) { // 如果根级有名字，就用根级的
            console.warn(`[${extensionName}] 'currentCharacter.data' 属性缺失或无效，尝试从角色根级获取信息...`);
            printCoreInfo(coreInfoFallback);
            return;
        } else { // 如果根级也没有，则彻底失败
             console.warn(`[${extensionName}] 获取角色信息失败：currentCharacter 存在，但其 'data' 属性不存在、不是对象或为 null/undefined。根级信息也缺失。`);
             console.log(`[${extensionName}] Current character object (inspect structure):`, currentCharacter);
             toastr.warning("角色数据 (data 属性或根级) 不完整或格式错误，无法提取核心信息。", "获取角色信息失败");
             return;
        }
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

    printCoreInfo(coreInfo);
}

/**
 * 辅助函数：打印核心信息并显示 toastr
 * @param {object} coreInfo 包含核心信息的对象
 */
function printCoreInfo(coreInfo) {
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
