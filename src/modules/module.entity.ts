import { AcademicEntity } from './academic/academic.entity';
import { GateEntity } from './gate/gate.entity';

export const ModuleEntity = [...GateEntity, ...AcademicEntity];
