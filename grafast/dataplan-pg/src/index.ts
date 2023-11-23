import { exportAsMany } from "grafast";

import {
  _AnyPgCodecAttribute,
  _AnyPgCodecAttributeVia,
  _AnyPgCodecAttributeViaAttribute,
  _AnyPgCodecAttributeViaRelationName,
  domainOfCodec,
  enumCodec,
  GenericPgCodecAttribute,
  GenericPgCodecAttributeVia,
  getCodecByPgCatalogTypeName,
  getInnerCodec,
  isEnumCodec,
  listOfCodec,
  ObjectFromPgCodecAttributes,
  PgCodecAttribute,
  PgCodecAttributeExtensions,
  PgCodecAttributeVia,
  PgCodecAttributeViaExplicit,
  PgEnumCodecSpec,
  PgRecordTypeCodecSpec,
  rangeOfCodec,
  recordCodec,
  TYPES,
} from "./codecs.js";
import {
  PgBox,
  PgCircle,
  PgHStore,
  PgInterval,
  PgLine,
  PgLseg,
  PgPath,
  PgPoint,
  PgPolygon,
} from "./codecUtils/index.js";
import {
  _AnyPgFunctionResourceOptions,
  _AnyPgRegistryBuilder,
  _AnyPgResource,
  _AnyPgResourceOptions,
  _AnyPgResourceParameter,
  _AnyPgResourceUnique,
  _AnyScalarPgResource,
  DefaultRegistryBuilder,
  EmptyRegistryBuilder,
  GenericPgFunctionResourceOptions,
  GenericPgResource,
  GenericPgResourceOptions,
  GenericPgResourceParameter,
  GenericPgResourceUnique,
  makePgResourceOptions,
  makeRegistry,
  makeRegistryBuilder,
  PgCodecRef,
  PgCodecRefExtensions,
  PgCodecRefPath,
  PgCodecRefPathEntry,
  PgCodecRefs,
  PgFunctionResourceOptions,
  PgRegistryBuilder,
  PgResource,
  PgResourceExtensions,
  PgResourceOptions,
  PgResourceParameter,
  PgResourceUnique,
  PgResourceUniqueExtensions,
} from "./datasource.js";
import {
  PgClient,
  PgClientQuery,
  PgClientResult,
  PgExecutor,
  PgExecutorContext,
  PgExecutorContextPlans,
  PgExecutorInput,
  PgExecutorMutationOptions,
  PgExecutorOptions,
  WithPgClient,
} from "./executor.js";
import { PgBooleanFilterStep } from "./filters/pgBooleanFilter.js";
import { PgClassFilterStep } from "./filters/pgClassFilter.js";
import { PgManyFilterStep } from "./filters/pgManyFilter.js";
import { PgOrFilterStep } from "./filters/pgOrFilter.js";
import {
  _AnyPgCodec,
  _AnyPgCodecAttributesRecord,
  _AnyPgCodecRelationConfig,
  _AnyPgRangeItemCodec,
  _AnyPgRegistry,
  _AnyPgRegistryConfig,
  _AnyPgRelation,
  _AnyScalarPgCodec,
  DefaultScalarPgCodec,
  GenericPgCodec,
  GenericPgCodecAttributesRecord,
  GenericPgCodecRelationConfig,
  GenericPgCodecWithAttributes,
  GenericPgRangeItemCodec,
  GenericPgRegistry,
  GenericPgRegistryConfig,
  GenericPgRelation,
  GetPgRegistryCodecRelations,
  GetPgRegistryCodecs,
  GetPgRegistrySources,
  GetPgResourceAttributes,
  GetPgResourceCodec,
  GetPgResourceRegistry,
  GetPgResourceRelations,
  GetPgResourceUniques,
  KeysOfType,
  MakePgServiceOptions,
  PgClassSingleStep,
  PgCodec,
  PgCodecAnyScalar,
  PgCodecAttributes,
  PgCodecAttributesRecord,
  PgCodecExtensions,
  PgCodecFromJavaScript,
  PgCodecFromPg,
  PgCodecFromPostgres,
  PgCodecList,
  PgCodecName,
  PgCodecPolymorphism,
  PgCodecPolymorphismRelational,
  PgCodecPolymorphismRelationalTypeSpec,
  PgCodecPolymorphismSingle,
  PgCodecPolymorphismSingleTypeAttributeSpec,
  PgCodecPolymorphismSingleTypeSpec,
  PgCodecPolymorphismUnion,
  PgCodecRelationBase,
  PgCodecRelationConfig,
  PgCodecRelationConfigLocalCodec,
  PgCodecRelationConfigName,
  PgCodecRelationConfigRemoteResourceOptions,
  PgCodecRelationExtensions,
  PgCodecWithAttributes,
  PgConditionLikeStep,
  PgDecode,
  PgEncode,
  PgEnumCodec,
  PgEnumValue,
  PgGroupSpec,
  PgOrderAttributeSpec,
  PgOrderFragmentSpec,
  PgOrderSpec,
  PgRefDefinition,
  PgRefDefinitionExtensions,
  PgRefDefinitions,
  PgRegistry,
  PgRegistryCodecRelations,
  PgRegistryCodecs,
  PgRegistryConfig,
  PgRegistryConfigCodecs,
  PgRegistryConfigRelationConfigs,
  PgRegistryConfigResourceOptions,
  PgRegistryRelationConfigs,
  PgRegistryResourceOptions,
  PgRegistryResources,
  PgRelation,
  PgTypedExecutableStep,
  PlanByUniques,
  TuplePlanMap,
} from "./interfaces.js";
import { PgLockableParameter, PgLockCallback } from "./pgLocker.js";
import {
  pgClassExpression,
  PgClassExpressionStep,
} from "./steps/pgClassExpression.js";
import {
  PgConditionCapableParentStep,
  PgConditionStep,
  PgConditionStepExtensions,
  PgHavingConditionSpec,
  PgWhereConditionSpec,
  pgWhereConditionSpecListToSQL,
} from "./steps/pgCondition.js";
import { PgCursorStep } from "./steps/pgCursor.js";
import {
  _AnyPgDeleteSingleStep,
  GenericPgDeleteSingleStep,
  pgDeleteSingle,
  PgDeleteSingleStep,
} from "./steps/pgDeleteSingle.js";
import { pgInsertSingle, PgInsertSingleStep } from "./steps/pgInsertSingle.js";
import { pgPageInfo, PgPageInfoStep } from "./steps/pgPageInfo.js";
import {
  pgPolymorphic,
  PgPolymorphicStep,
  PgPolymorphicTypeMap,
} from "./steps/pgPolymorphic.js";
import {
  _AnyPgSelectStep,
  digestsFromArgumentSpecs,
  GenericPgSelectStep,
  pgSelect,
  PgSelectArgumentDigest,
  PgSelectArgumentSpec,
  pgSelectFromRecords,
  PgSelectIdentifierSpec,
  PgSelectMode,
  PgSelectOptions,
  PgSelectParsedCursorStep,
  PgSelectStep,
  sqlFromArgDigests,
} from "./steps/pgSelect.js";
import {
  _AnyPgSelectSinglePlanOptions,
  _AnyPgSelectSingleStep,
  GenericPgSelectSingleStep,
  pgSelectFromRecord,
  pgSelectSingleFromRecord,
  PgSelectSinglePlanOptions,
  PgSelectSingleStep,
} from "./steps/pgSelectSingle.js";
import {
  pgSingleTablePolymorphic,
  PgSingleTablePolymorphicStep,
} from "./steps/pgSingleTablePolymorphic.js";
import { PgTempTableStep } from "./steps/pgTempTable.js";
import {
  pgUnionAll,
  PgUnionAllSingleStep,
  PgUnionAllStep,
  PgUnionAllStepCondition,
  PgUnionAllStepConfig,
  PgUnionAllStepConfigAttributes,
  PgUnionAllStepMember,
  PgUnionAllStepOrder,
} from "./steps/pgUnionAll.js";
import {
  _AnyPgUpdateSingleStep,
  GenericPgUpdateSingleStep,
  pgUpdateSingle,
  PgUpdateSingleStep,
} from "./steps/pgUpdateSingle.js";
import {
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
} from "./steps/pgValidateParsedCursor.js";
import { toPg, ToPgStep } from "./steps/toPg.js";
import {
  withPgClient,
  WithPgClientStep,
  WithPgClientStepCallback,
  withPgClientTransaction,
} from "./steps/withPgClient.js";
import { assertPgClassSingleStep } from "./utils.js";

export {
  _AnyPgCodec,
  _AnyPgCodecAttribute,
  _AnyPgCodecAttributesRecord,
  _AnyPgCodecAttributeVia,
  _AnyPgCodecAttributeViaAttribute,
  _AnyPgCodecAttributeViaRelationName,
  _AnyPgCodecRelationConfig,
  _AnyPgDeleteSingleStep,
  _AnyPgFunctionResourceOptions,
  _AnyPgRegistry,
  _AnyPgRegistryBuilder,
  _AnyPgRegistryConfig,
  _AnyPgRelation,
  _AnyPgResource,
  _AnyPgResourceOptions,
  _AnyPgResourceParameter,
  _AnyPgResourceUnique,
  _AnyPgSelectSinglePlanOptions,
  _AnyPgSelectSingleStep,
  _AnyPgSelectStep,
  _AnyPgUpdateSingleStep,
  _AnyScalarPgCodec,
  _AnyScalarPgResource,
  assertPgClassSingleStep,
  DefaultRegistryBuilder,
  DefaultScalarPgCodec,
  digestsFromArgumentSpecs,
  domainOfCodec,
  EmptyRegistryBuilder,
  enumCodec,
  GenericPgCodec,
  GenericPgCodecAttribute,
  GenericPgCodecAttributesRecord,
  GenericPgCodecAttributeVia,
  GenericPgCodecRelationConfig,
  GenericPgCodecWithAttributes,
  GenericPgDeleteSingleStep,
  GenericPgFunctionResourceOptions,
  GenericPgRangeItemCodec,
  GenericPgRegistry,
  GenericPgRegistryConfig,
  GenericPgRelation,
  GenericPgResource,
  GenericPgResourceOptions,
  GenericPgResourceParameter,
  GenericPgResourceUnique,
  GenericPgSelectSingleStep,
  GenericPgSelectStep,
  GenericPgUpdateSingleStep,
  getCodecByPgCatalogTypeName,
  getInnerCodec,
  GetPgRegistryCodecRelations,
  GetPgRegistryCodecs,
  GetPgRegistrySources,
  GetPgResourceAttributes,
  GetPgResourceCodec,
  GetPgResourceRegistry,
  GetPgResourceRelations,
  GetPgResourceUniques,
  isEnumCodec,
  KeysOfType,
  listOfCodec,
  makePgResourceOptions,
  MakePgServiceOptions,
  makeRegistry,
  makeRegistryBuilder,
  ObjectFromPgCodecAttributes,
  PgBooleanFilterStep,
  PgBox,
  PgCircle,
  pgClassExpression,
  PgClassExpressionStep,
  PgClassFilterStep,
  PgClassSingleStep,
  PgClient,
  PgClientQuery,
  PgClientResult,
  PgCodec,
  PgCodecAnyScalar,
  PgCodecAttribute,
  PgCodecAttributeExtensions,
  PgCodecAttributes,
  PgCodecAttributesRecord,
  PgCodecAttributeVia,
  PgCodecAttributeViaExplicit,
  PgCodecExtensions,
  PgCodecFromJavaScript,
  PgCodecFromPg,
  PgCodecFromPostgres,
  PgCodecList,
  PgCodecName,
  PgCodecPolymorphism,
  PgCodecPolymorphismRelational,
  PgCodecPolymorphismRelationalTypeSpec,
  PgCodecPolymorphismSingle,
  PgCodecPolymorphismSingleTypeAttributeSpec,
  PgCodecPolymorphismSingleTypeSpec,
  PgCodecPolymorphismUnion,
  PgCodecRef,
  PgCodecRefExtensions,
  PgCodecRefPath,
  PgCodecRefPathEntry,
  PgCodecRefs,
  PgRelation as PgCodecRelation,
  PgCodecRelationBase,
  PgCodecRelationConfig,
  PgCodecRelationConfigLocalCodec,
  PgCodecRelationConfigName,
  PgCodecRelationConfigRemoteResourceOptions,
  PgCodecRelationExtensions,
  PgCodecWithAttributes,
  PgConditionCapableParentStep,
  PgConditionLikeStep,
  PgConditionStep,
  PgConditionStepExtensions,
  PgCursorStep,
  PgDecode,
  pgDeleteSingle,
  PgDeleteSingleStep,
  PgEncode,
  PgEnumCodec,
  PgEnumCodecSpec,
  PgEnumValue,
  PgExecutor,
  PgExecutorContext,
  PgExecutorContextPlans,
  PgExecutorInput,
  PgExecutorMutationOptions,
  PgExecutorOptions,
  PgFunctionResourceOptions,
  PgGroupSpec,
  PgHavingConditionSpec,
  PgHStore,
  pgInsertSingle,
  PgInsertSingleStep,
  PgInterval,
  PgLine,
  PgLockableParameter,
  PgLockCallback,
  PgLseg,
  PgManyFilterStep,
  PgOrderAttributeSpec,
  PgOrderFragmentSpec,
  PgOrderSpec,
  PgOrFilterStep,
  pgPageInfo,
  PgPageInfoStep,
  PgPath,
  PgPoint,
  PgPolygon,
  pgPolymorphic,
  PgPolymorphicStep,
  PgPolymorphicTypeMap,
  _AnyPgRangeItemCodec as PgRangeItemCodec,
  PgRecordTypeCodecSpec,
  PgRefDefinition,
  PgRefDefinitionExtensions,
  PgRefDefinitions,
  PgRegistry,
  PgRegistryBuilder,
  PgRegistryCodecRelations,
  PgRegistryCodecs,
  PgRegistryConfig,
  PgRegistryConfigCodecs,
  PgRegistryConfigRelationConfigs,
  PgRegistryConfigResourceOptions,
  PgRegistryRelationConfigs,
  PgRegistryResourceOptions,
  PgRegistryResources,
  PgRelation,
  PgResource,
  PgResourceExtensions,
  PgResourceOptions,
  PgResourceParameter,
  PgResourceUnique,
  PgResourceUniqueExtensions,
  pgSelect,
  PgSelectArgumentDigest,
  PgSelectArgumentSpec,
  pgSelectFromRecord,
  pgSelectFromRecords,
  PgSelectIdentifierSpec,
  PgSelectMode,
  PgSelectOptions,
  PgSelectParsedCursorStep,
  pgSelectSingleFromRecord,
  PgSelectSinglePlanOptions,
  PgSelectSingleStep,
  PgSelectStep,
  pgSingleTablePolymorphic,
  PgSingleTablePolymorphicStep,
  PgTempTableStep,
  PgTypedExecutableStep,
  pgUnionAll,
  PgUnionAllSingleStep,
  PgUnionAllStep,
  PgUnionAllStepCondition,
  PgUnionAllStepConfig,
  PgUnionAllStepConfigAttributes,
  PgUnionAllStepMember,
  PgUnionAllStepOrder,
  pgUpdateSingle,
  PgUpdateSingleStep,
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
  PgWhereConditionSpec,
  pgWhereConditionSpecListToSQL,
  PlanByUniques,
  rangeOfCodec,
  recordCodec,
  sqlFromArgDigests,
  toPg,
  ToPgStep,
  TuplePlanMap,
  TYPES,
  WithPgClient,
  withPgClient,
  WithPgClientStep,
  WithPgClientStepCallback,
  withPgClientTransaction,
};

exportAsMany("@dataplan/pg", {
  assertPgClassSingleStep,
  domainOfCodec,
  getInnerCodec,
  enumCodec,
  getCodecByPgCatalogTypeName,
  isEnumCodec,
  listOfCodec,
  rangeOfCodec,
  recordCodec,
  makeRegistryBuilder,
  makeRegistry,
  makePgResourceOptions,
  TYPES,
  PgResource,
  PgExecutor,
  PgBooleanFilterStep,
  PgClassFilterStep,
  PgManyFilterStep,
  PgOrFilterStep,
  pgClassExpression,
  PgClassExpressionStep,
  PgConditionStep,
  pgWhereConditionSpecListToSQL,
  PgCursorStep,
  pgDeleteSingle,
  PgDeleteSingleStep,
  pgInsertSingle,
  PgInsertSingleStep,
  pgPageInfo,
  PgPageInfoStep,
  pgPolymorphic,
  PgPolymorphicStep,
  pgSelect,
  digestsFromArgumentSpecs,
  pgSelectFromRecords,
  PgSelectStep,
  sqlFromArgDigests,
  pgSelectFromRecord,
  pgSelectSingleFromRecord,
  PgSelectSingleStep,
  pgSingleTablePolymorphic,
  pgUnionAll,
  PgUnionAllSingleStep,
  PgUnionAllStep,
  PgSingleTablePolymorphicStep,
  pgUpdateSingle,
  PgUpdateSingleStep,
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
  PgTempTableStep,
  toPg,
  ToPgStep,
  withPgClient,
  withPgClientTransaction,
  WithPgClientStep,
});

export {
  /** @deprecated Use Pg prefix */
  PgBooleanFilterStep as BooleanFilterStep,
  /** @deprecated Use Pg prefix */
  PgClassFilterStep as ClassFilterStep,
  /** @deprecated Use Pg prefix */
  PgManyFilterStep as ManyFilterStep,
  /** @deprecated Use Pg prefix */
  PgOrFilterStep as OrFilterStep,
  /** @deprecated Use Pg prefix */
  PgTempTableStep as TempTableStep,
};

export { version } from "./version.js";
