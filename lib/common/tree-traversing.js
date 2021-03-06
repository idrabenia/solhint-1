
class TreeTraversing {

    statementNotContains(ctx, type) {
        let statement = this.findParentStatement(ctx);

        if (!statement) {
            return false;
        }

        let itemOfType = this.findDownType(statement, type);

        return itemOfType !== null;
    }

    findParentStatement(ctx) {
        while (ctx.parentCtx != null && ctx.parentCtx.constructor.name !== 'StatementContext') {
            ctx = ctx.parentCtx;
        }

        return ctx.parentCtx;
    }

    findParentType(ctx, type) {
        while (ctx.parentCtx != null && ctx.parentCtx.constructor.name !== type) {
            ctx = ctx.parentCtx;
        }

        return ctx.parentCtx;
    }

    findDownType(ctx, type) {
        if (!ctx || ctx.constructor.name === type) {
            return ctx;
        } else if (ctx.children) {
            let items = ctx
                .children
                .map(i => this.findDownType(i, type))
                .filter(i => i !== null);

            return items.length > 0 && items[0] || null;
        } else {
            return null;
        }
    }

    findTypeInChildren(ctx, type) {
        if (ctx.children) {
            let items = ctx.children.filter(i => i.constructor.name === type);

            return items.length > 0 && items[0] || null;
        } else {
            return null;
        }
    }

    *findIdentifier(ctx) {
        const children = ctx.children;

        for (let i = 0; i < children.length; i += 1) {
            if (children[i].constructor.name === 'IdentifierContext') {
                yield children[i];
            }
        }

        return null;
    }

}


TreeTraversing.typeOf = function (ctx) {
    if (!ctx) {
        return '';
    }

    const className = ctx.constructor.name;
    const typeName = className.replace('Context', '');
    return typeName[0].toLowerCase() + typeName.substring(1);
};


TreeTraversing.hasMethodCalls = function  (ctx, methodNames) {
    const text = ctx.getText();

    return methodNames.some(i => text.startsWith(`${i}(`));
};


module.exports = TreeTraversing;