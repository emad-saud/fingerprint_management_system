import { Optional } from 'sequelize';

interface PublicHolidayAttributes {
  id: string;
  date: string;
  name: string;
  type: 'official' | 'sick' | 'personal';
  empId: number | undefined;
}

interface PublicHolidayCreationAttributes
  extends Optional<PublicHolidayAttributes, 'id'> {}

export { PublicHolidayAttributes, PublicHolidayCreationAttributes };
