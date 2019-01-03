{{# def.definitions }}
{{# def.errors }}
{{# def.setupKeyword }}

{{## def._validateRef:_v:
  {{? it.opts.passContext }}
    {{=_v}}.call(this,
  {{??}}
    {{=_v}}(
  {{?}}
    {{=$data}}, {{# def.dataPath }}{{# def.passParentData }}, rootData)
#}}

{{ var $async, $refCode; }}
{{? $schema == '#' || $schema == '#/' }}
  {{
    if (it.isRoot) {
      $async = it.async;
      $refCode = 'validate';
    } else {
      $async = it.root.schema.$async === true;
      $refCode = 'root.refVal[0]';
    }
  }}
{{??}}
  {{ var $refVal = it.resolveRef(it.baseId, $schema, it.isRoot); }}
  {{? $refVal === undefined }}
    {{ var $message = it.MissingRefError.message(it.baseId, $schema); }}
    {{? it.opts.missingRefs