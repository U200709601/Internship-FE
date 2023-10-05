import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';

import { useTranslation } from 'react-i18next';
import Organisation from './Organisation';
// ----------------------------------------------------------------------


export default function Organisations() {
    const { t } = useTranslation();

    const TABS = [
        { id: 0, label: t('organisation'), component: <Organisation /> },
        
    ];

    const TITLE = t('organisation');

    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
