import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';
import { useTranslation } from 'react-i18next';
import NumberMapping from './numberMapping/NumberMapping';
import ManageUc from './manage/ManageUc';
// ----------------------------------------------------------------------

export default function Config() {
    const { t } = useTranslation();

    const TABS = [
        {id: 0, label: t('manage'), component: <ManageUc/> },
        { id: 1, label: t('number-mapping'), component: <NumberMapping /> },
        
        
    ];

    const TITLE = t('config');

    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
