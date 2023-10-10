import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';
import { useTranslation } from 'react-i18next';
import { Features } from './ucCommunications';
// ----------------------------------------------------------------------


export default function UcCommunications() {
    const { t } = useTranslation();

    const TABS = [
        { id: 0, label: t('features'), component: <Features /> },
    ];

    const TITLE = t('uc-communication');

    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
